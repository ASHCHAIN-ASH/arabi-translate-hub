-- دوال PostgreSQL للتقارير المحاسبية

-- دالة ميزان المراجعة
CREATE OR REPLACE FUNCTION get_trial_balance(from_date DATE, to_date DATE)
RETURNS TABLE (
    account_code VARCHAR,
    account_name VARCHAR,
    debit_total DECIMAL,
    credit_total DECIMAL,
    balance DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        la.code as account_code,
        la.name as account_name,
        COALESCE(SUM(jl.debit_amount), 0) as debit_total,
        COALESCE(SUM(jl.credit_amount), 0) as credit_total,
        CASE 
            WHEN la.type IN ('asset', 'expense') THEN 
                COALESCE(SUM(jl.debit_amount), 0) - COALESCE(SUM(jl.credit_amount), 0)
            ELSE 
                COALESCE(SUM(jl.credit_amount), 0) - COALESCE(SUM(jl.debit_amount), 0)
        END as balance
    FROM ledger_accounts la
    LEFT JOIN journal_lines jl ON la.id = jl.account_id
    LEFT JOIN journal_entries je ON jl.entry_id = je.id
    WHERE la.is_active = true
    AND (je.entry_date IS NULL OR je.entry_date BETWEEN from_date AND to_date)
    GROUP BY la.id, la.code, la.name, la.type
    HAVING COALESCE(SUM(jl.debit_amount), 0) + COALESCE(SUM(jl.credit_amount), 0) > 0
    ORDER BY la.code;
END;
$$ LANGUAGE plpgsql;

-- دالة دفتر الأستاذ العام
CREATE OR REPLACE FUNCTION get_general_ledger(account_id_param UUID, from_date DATE, to_date DATE)
RETURNS TABLE (
    entry_date DATE,
    entry_number VARCHAR,
    reference VARCHAR,
    memo TEXT,
    debit_amount DECIMAL,
    credit_amount DECIMAL,
    balance DECIMAL
) AS $$
DECLARE
    running_balance DECIMAL := 0;
    account_type VARCHAR;
BEGIN
    -- الحصول على نوع الحساب
    SELECT type INTO account_type 
    FROM ledger_accounts 
    WHERE id = account_id_param;

    -- إنشاء جدول مؤقت للنتائج
    CREATE TEMP TABLE temp_gl_entries (
        entry_date DATE,
        entry_number VARCHAR,
        reference VARCHAR,
        memo TEXT,
        debit_amount DECIMAL,
        credit_amount DECIMAL,
        balance DECIMAL
    );

    -- إدراج البيانات مع حساب الرصيد التراكمي
    FOR entry_date, entry_number, reference, memo, debit_amount, credit_amount IN
        SELECT 
            je.entry_date,
            je.entry_number,
            je.reference,
            je.memo,
            jl.debit_amount,
            jl.credit_amount
        FROM journal_lines jl
        JOIN journal_entries je ON jl.entry_id = je.id
        WHERE jl.account_id = account_id_param
        AND je.entry_date BETWEEN from_date AND to_date
        ORDER BY je.entry_date, je.entry_number
    LOOP
        -- حساب الرصيد حسب نوع الحساب
        IF account_type IN ('asset', 'expense') THEN
            running_balance := running_balance + debit_amount - credit_amount;
        ELSE
            running_balance := running_balance + credit_amount - debit_amount;
        END IF;

        INSERT INTO temp_gl_entries VALUES (
            entry_date, entry_number, reference, memo, 
            debit_amount, credit_amount, running_balance
        );
    END LOOP;

    -- إرجاع النتائج
    RETURN QUERY SELECT * FROM temp_gl_entries ORDER BY entry_date, entry_number;

    -- حذف الجدول المؤقت
    DROP TABLE temp_gl_entries;
END;
$$ LANGUAGE plpgsql;

-- دالة ملخص الضريبة
CREATE OR REPLACE FUNCTION get_tax_summary(from_date DATE, to_date DATE)
RETURNS TABLE (
    taxable_sales DECIMAL,
    tax_amount DECIMAL,
    tax_rate DECIMAL,
    period TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(
            CASE 
                WHEN jl.account_id IN (
                    SELECT id FROM ledger_accounts WHERE type = 'revenue'
                ) THEN jl.credit_amount
                ELSE 0
            END
        ), 0) as taxable_sales,
        COALESCE(SUM(
            CASE 
                WHEN jl.account_id IN (
                    SELECT id FROM ledger_accounts WHERE code = '2120' -- الضريبة المستحقة
                ) THEN jl.credit_amount
                ELSE 0
            END
        ), 0) as tax_amount,
        COALESCE(
            (SELECT rate_percent FROM tax_rates WHERE is_default = true LIMIT 1), 
            15.00
        ) as tax_rate,
        (from_date::TEXT || ' إلى ' || to_date::TEXT) as period
    FROM journal_lines jl
    JOIN journal_entries je ON jl.entry_id = je.id
    WHERE je.entry_date BETWEEN from_date AND to_date;
END;
$$ LANGUAGE plpgsql;

-- دالة كشف حساب عميل
CREATE OR REPLACE FUNCTION get_customer_statement(customer_id_param VARCHAR, from_date DATE, to_date DATE)
RETURNS TABLE (
    entry_date DATE,
    entry_number VARCHAR,
    reference VARCHAR,
    memo TEXT,
    debit_amount DECIMAL,
    credit_amount DECIMAL,
    balance DECIMAL
) AS $$
DECLARE
    running_balance DECIMAL := 0;
BEGIN
    -- إنشاء جدول مؤقت للنتائج
    CREATE TEMP TABLE temp_customer_statement (
        entry_date DATE,
        entry_number VARCHAR,
        reference VARCHAR,
        memo TEXT,
        debit_amount DECIMAL,
        credit_amount DECIMAL,
        balance DECIMAL
    );

    -- إدراج البيانات مع حساب الرصيد التراكمي
    FOR entry_date, entry_number, reference, memo, debit_amount, credit_amount IN
        SELECT 
            je.entry_date,
            je.entry_number,
            je.reference,
            je.memo,
            jl.debit_amount,
            jl.credit_amount
        FROM journal_lines jl
        JOIN journal_entries je ON jl.entry_id = je.id
        WHERE jl.customer_id = customer_id_param
        AND je.entry_date BETWEEN from_date AND to_date
        ORDER BY je.entry_date, je.entry_number
    LOOP
        -- حساب الرصيد (الذمم المدينة - مدين موجب، دائن سالب)
        running_balance := running_balance + debit_amount - credit_amount;

        INSERT INTO temp_customer_statement VALUES (
            entry_date, entry_number, reference, memo, 
            debit_amount, credit_amount, running_balance
        );
    END LOOP;

    -- إرجاع النتائج
    RETURN QUERY SELECT * FROM temp_customer_statement ORDER BY entry_date, entry_number;

    -- حذف الجدول المؤقت
    DROP TABLE temp_customer_statement;
END;
$$ LANGUAGE plpgsql;

-- دالة الملخص المالي
CREATE OR REPLACE FUNCTION get_financial_summary(as_of_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    total_assets DECIMAL,
    total_liabilities DECIMAL,
    total_equity DECIMAL,
    total_revenue DECIMAL,
    total_expenses DECIMAL,
    net_income DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        -- إجمالي الأصول
        COALESCE(SUM(
            CASE 
                WHEN la.type = 'asset' THEN 
                    COALESCE(SUM(jl.debit_amount), 0) - COALESCE(SUM(jl.credit_amount), 0)
                ELSE 0
            END
        ), 0) as total_assets,
        
        -- إجمالي الخصوم
        COALESCE(SUM(
            CASE 
                WHEN la.type = 'liability' THEN 
                    COALESCE(SUM(jl.credit_amount), 0) - COALESCE(SUM(jl.debit_amount), 0)
                ELSE 0
            END
        ), 0) as total_liabilities,
        
        -- حقوق الملكية
        COALESCE(SUM(
            CASE 
                WHEN la.type = 'equity' THEN 
                    COALESCE(SUM(jl.credit_amount), 0) - COALESCE(SUM(jl.debit_amount), 0)
                ELSE 0
            END
        ), 0) as total_equity,
        
        -- إجمالي الإيرادات
        COALESCE(SUM(
            CASE 
                WHEN la.type = 'revenue' THEN 
                    COALESCE(SUM(jl.credit_amount), 0) - COALESCE(SUM(jl.debit_amount), 0)
                ELSE 0
            END
        ), 0) as total_revenue,
        
        -- إجمالي المصروفات
        COALESCE(SUM(
            CASE 
                WHEN la.type = 'expense' THEN 
                    COALESCE(SUM(jl.debit_amount), 0) - COALESCE(SUM(jl.credit_amount), 0)
                ELSE 0
            END
        ), 0) as total_expenses,
        
        -- صافي الدخل (الإيرادات - المصروفات)
        COALESCE(SUM(
            CASE 
                WHEN la.type = 'revenue' THEN 
                    COALESCE(SUM(jl.credit_amount), 0) - COALESCE(SUM(jl.debit_amount), 0)
                ELSE 0
            END
        ), 0) - COALESCE(SUM(
            CASE 
                WHEN la.type = 'expense' THEN 
                    COALESCE(SUM(jl.debit_amount), 0) - COALESCE(SUM(jl.credit_amount), 0)
                ELSE 0
            END
        ), 0) as net_income

    FROM ledger_accounts la
    LEFT JOIN journal_lines jl ON la.id = jl.account_id
    LEFT JOIN journal_entries je ON jl.entry_id = je.id
    WHERE la.is_active = true
    AND (je.entry_date IS NULL OR je.entry_date <= as_of_date)
    GROUP BY ();
END;
$$ LANGUAGE plpgsql;

-- دالة للحصول على أرصدة الحسابات الرئيسية
CREATE OR REPLACE FUNCTION get_main_account_balances(as_of_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    account_type VARCHAR,
    account_code VARCHAR,
    account_name VARCHAR,
    balance DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        la.type as account_type,
        la.code as account_code,
        la.name as account_name,
        CASE 
            WHEN la.type IN ('asset', 'expense') THEN 
                COALESCE(SUM(jl.debit_amount), 0) - COALESCE(SUM(jl.credit_amount), 0)
            ELSE 
                COALESCE(SUM(jl.credit_amount), 0) - COALESCE(SUM(jl.debit_amount), 0)
        END as balance
    FROM ledger_accounts la
    LEFT JOIN journal_lines jl ON la.id = jl.account_id
    LEFT JOIN journal_entries je ON jl.entry_id = je.id
    WHERE la.is_active = true
    AND la.parent_id IS NULL -- الحسابات الرئيسية فقط
    AND (je.entry_date IS NULL OR je.entry_date <= as_of_date)
    GROUP BY la.id, la.type, la.code, la.name
    ORDER BY la.code;
END;
$$ LANGUAGE plpgsql;