-- -----------------------------------------------------
-- Schema alotest
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `alotest`;
USE `alotest` ;

-- -----------------------------------------------------
-- Table `alotest`.`salts`
-- -----------------------------------------------------
CREATE TABLE `salts` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `userid` INT(11) NOT NULL,
  `salt` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `alotest`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alotest`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL unique,
  `username` VARCHAR(18) NOT NULL unique,
  `pwhash` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;

insert into users values (1, 'alingofilho@gmail.com', 'laosioor', 'uekVdnPnIvfpsyBILLM/nBl8ZIJfM0GODjSuyQe8+qQ3M0fmb0K3l+9VsZAccFriQnLFACkzRdW5xblGOHx+Gcl8kykX0Ue5t5XBmESAUHEceu7Ka2cOCT6uhB1aSQxFDDN9mjKU0nQBpOYimIfA0fy2h2HBLiI6f6g0K117DGWiI8Mrn4I0LEe8Kh6Q8T94fLXQpbzv7PhOBlQ5HezdHkzmPgYH401SYv5Ju3KKV3D5b7ikNFLZt8dMDFqRfJ1');

insert into salts values (1, 1, 'dQeplBoMGQlHBm6euu0CS7Divxp3gR4KNG9l0fQPqLnD0X4STqDDfD9iEfvfy_IYz5zEaqPyOPFmh6ux4BEesYhm4Q6-qaKkB5XocXejj4H7pREIj16IOWWnPpMeZ92bDlY57oObQH1CyfnSNHvFELMmx3tpojFp39qDmq5MXx2HcOWnMPQ1vxjdMLft92SuyNcqXdueynwYPSX7kcxxqPHbGs8t5HOgMoG6TbhFf5qi1ueq4j5Ty6GvtZBqD1m'
);
