-- -----------------------------------------------------
-- Schema achroma
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `achroma`;
USE `achroma` ;

-- -----------------------------------------------------
-- Table `achroma`.`salts`
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
-- Table `achroma`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `achroma`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL unique,
  `username` VARCHAR(18) NOT NULL unique,
  `pwhash` VARCHAR(255) NOT NULL,
  `behance` VARCHAR(50) default '',
  `deviantart` VARCHAR(50) default '',
  `pinterest` VARCHAR(50) default '',
  `twitter` VARCHAR(50) default '',
  `profissao` VARCHAR(100) default '',
  `bio` VARCHAR(255) default '',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `achroma`.`chromas` (
	imageid int(11) not null auto_increment,
    userid int(11) not null,
    primary key(imageid),
    foreign key(userid) references users(id))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;

insert into users values (1, 'alingofilho@gmail.com', 'laosioor', 'uekVdnPnIvfpsyBILLM/nBl8ZIJfM0GODjSuyQe8+qQ3M0fmb0K3l+9VsZAccFriQnLFACkzRdW5xblGOHx+Gcl8kykX0Ue5t5XBmESAUHEceu7Ka2cOCT6uhB1aSQxFDDN9mjKU0nQBpOYimIfA0fy2h2HBLiI6f6g0K117DGWiI8Mrn4I0LEe8Kh6Q8T94fLXQpbzv7PhOBlQ5HezdHkzmPgYH401SYv5Ju3KKV3D5b7ikNFLZt8dMDFqRfJ1', 'laosioor', 'laosioor', 'laosioor', 'laosioor', 'Programador', 'Criei o site, meio pá das idéias agora... mas depois miora né mano?... né?');
insert into salts values (1, 1, 'dQeplBoMGQlHBm6euu0CS7Divxp3gR4KNG9l0fQPqLnD0X4STqDDfD9iEfvfy_IYz5zEaqPyOPFmh6ux4BEesYhm4Q6-qaKkB5XocXejj4H7pREIj16IOWWnPpMeZ92bDlY57oObQH1CyfnSNHvFELMmx3tpojFp39qDmq5MXx2HcOWnMPQ1vxjdMLft92SuyNcqXdueynwYPSX7kcxxqPHbGs8t5HOgMoG6TbhFf5qi1ueq4j5Ty6GvtZBqD1m'
);

insert into users values(2, 'cakedev663@gmail.com', 'CakeDEV', 'mvM8MvQyeUWuucdeUZO99Nr+8nxuSZAeRwDCo4XI57jAb8rEfE3o0tNcW9E9asg5Qb9tAEhAWiqm/pYbUhLRC2woxPqbELN7Uyb5VmR898FIFN0WrLec7DZn8QCiQsqkg7TwqP1pX8ah244QOcjWKNkDHHsr4eLWQaBwg+HXPJKlD6W0H1+4YIm8gc7XzOoCSR/FLeZOhhGu9RscDB5ibHTlphn5Kbgf8RU0XeMRpUjOj76jHht5WddVi44I/QR', 'CakeDEV', 'CakeDEV', 'CakeDEV', 'CakeDEV', 'Designer', 'Sou dev desse site e gosto muito da Neo do RWBY');
insert into salts values(2, 2, 'sDx5o9v2HJxoBvqIBNa1jM-9_FsBXF157GK6Zxe_wHHF_lMnk_GkKJKMWgEv61eU9CXDmU87CvLdco8JHIcfbPbZXuH65lwKuHGR7Y11cMH-rDm4fKwK8woFyd9t1y0UlPDSS9ViCilrr75SV0nK0hN7qeIeRFHLc19zDMe1dd736CRUjzWErtT0VNUK6Djwi-_8QsLx7gDuR6dcfyPMNzR5o3VL_oZABiHYoTA9_8Gq0defpPgfQugOY56j_Ut');
