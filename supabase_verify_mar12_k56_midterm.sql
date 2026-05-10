-- Verify Mar12_K56 midterm roster after import

SELECT count(*) AS row_count FROM public."DS_Mar12_K56_Midterm.csv";
-- Expect 62

SELECT "MSV", count(*) AS c
FROM public."DS_Mar12_K56_Midterm.csv"
GROUP BY "MSV"
HAVING count(*) > 1;
-- Expect 0 rows

SELECT "Tên", "MSV", "Số câu đúng", "Điểm"
FROM public."DS_Mar12_K56_Midterm.csv"
ORDER BY "MSV"
LIMIT 5;
