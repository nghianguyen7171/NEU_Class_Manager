-- Sau import Sample

SELECT count(*) AS row_count FROM public."DS_Sample_Midterm.csv";
-- Expect 5

SELECT "MSV", count(*) AS c
FROM public."DS_Sample_Midterm.csv"
GROUP BY "MSV"
HAVING count(*) > 1;

SELECT "Tên", "MSV", "Số câu đúng", "Điểm"
FROM public."DS_Sample_Midterm.csv"
ORDER BY "MSV";
