# kss_nodejs
typescript for fizzbuzz and palindrome
* Dan Berikut Jawaban untuk Soal Query

1. Buat QUERY untuk menampilkan customerNumber siapa saja yang memesan
productLine Classic Cars dimana total hitung atau COUNT productionline
tersebut lebih besar dari 23.
```
SELECT c.customerNumber FROM
customers c JOIN orders o ON c.customerNumber = o.customerNumber
JOIN orderdetails od ON o.orderNumber = od.orderNumber
JOIN products p ON od.productCode = p.productCode
WHERE p.productLine = 'Classic Cars'
GROUP BY c.customerNumber HAVING COUNT(p.productLine) > 23;
```

2. Buat stored procedure pada mysql untuk mengekstrak isi dari ksm_kurs_pajak menjadi 1 table kurs pajak
```
DELIMITER //

CREATE PROCEDURE ExtractKursPajak()
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'An error occurred, transaction rolled back.';
  END;

  START TRANSACTION;

  -- Check if kurs_pajak table already has data, then rollback
  SELECT COUNT(*) INTO @kurs_pajak_count FROM kurs_pajak;
  IF @kurs_pajak_count > 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'kurs_pajak table already contains data, rolling back transaction.';
  END IF;

  -- Create kurs_pajak table
  CREATE TABLE IF NOT EXISTS kurs_pajak (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ksm_kurs_pajak_id INT,
    kurs_rate DECIMAL(10, 2),
    date DATE,
    curr_id INT
  );

  -- Variables for cursor to fetch data from ksm_kurs_pajak
  DECLARE done INT DEFAULT 0;
  DECLARE current_id INT;
  DECLARE current_kurs_rate DECIMAL(10, 2);
  DECLARE start_date DATE;
  DECLARE end_date DATE;
  DECLARE curr_id INT;
  DECLARE cur CURSOR FOR
    SELECT id, kurs_rate, start_date, end_date, curr_id
    FROM ksm_kurs_pajak;

  -- Fetch data from ksm_kurs_pajak and insert into kurs_pajak
  OPEN cur;
  read_loop: LOOP
    FETCH cur INTO current_id, current_kurs_rate, start_date, end_date, curr_id;
    IF done THEN
      LEAVE read_loop;
    END IF;

    -- Iterate through dates from start_date to end_date
    SET @current_date = start_date;
    WHILE @current_date <= end_date DO
      INSERT INTO kurs_pajak (ksm_kurs_pajak_id, kurs_rate, date, curr_id)
      VALUES (current_id, current_kurs_rate, @current_date, curr_id);
      SET @current_date = DATE_ADD(@current_date, INTERVAL 1 DAY);
    END WHILE;
  END LOOP;
  CLOSE cur;

  COMMIT;
END //

DELIMITER ;
```

3. Buatlah function pada mysql untuk mencari tanggal terkecil dari string yang ter-concatenated seperti berikut 
'2016-04-22, 2016-07-20, 2015-03-29, 2023-07-03'
apabila fungsi tersebut dipanggil maka output yang dihasilkan adalah 2015-03-29
```
DELIMITER //

CREATE FUNCTION FindMinDateFromConcatenatedString(date_string VARCHAR(255))
RETURNS DATE
BEGIN
  DECLARE min_date DATE;
  DECLARE current_date DATE;
  DECLARE date_list VARCHAR(255);
  DECLARE done INT DEFAULT 0;

  SET date_list = date_string;
  SET min_date = NULL;

  -- Loop to process the concatenated date string
  WHILE LENGTH(date_list) > 0 DO
    SET current_date = STR_TO_DATE(SUBSTRING_INDEX(date_list, ', ', 1), '%Y-%m-%d');
    SET date_list = SUBSTRING(date_list, LENGTH(SUBSTRING_INDEX(date_list, ', ', 1)) + 3);

    IF min_date IS NULL OR current_date < min_date THEN
      SET min_date = current_date;
    END IF;
  END WHILE;

  RETURN min_date;
END //

DELIMITER ;
```
