

CREATE TABLE IF NOT EXISTS fotos_filme (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS foto_pessoa(
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS pessoas (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome TEXT NOT NULL,
    idade INT NOT NULL,
    nacionalidade VARCHAR(255),
    atividade ENUM('ator', 'diretor', 'escritor'),
    foto VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS filmes (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    titulo TEXT NOT NULL,
    sinopse VARCHAR(255) NOT NULL,
    genero VARCHAR(255) NOT NULL,
    avaliacao INT NOT NULL,
    id_image TINYINT NOT NULL,
    direcao_id INT,
    foto_id INT,
    FOREIGN KEY (direcao_id) REFERENCES pessoas(ID),
    FOREIGN KEY (foto_id) REFERENCES fotos_filme(ID)
);
ALTER TABLE pessoas ADD COLUMN id_image INT;
ALTER TABLE pessoas ADD FOREIGN KEY (id_image) REFERENCES foto_pessoa(ID);
CREATE TABLE admin (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS users (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL
);
ALTER TABLE admin ADD COLUMN name VARCHAR(255);
CREATE TABLE IF NOT EXISTS avaliacoes (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    filme_id INT NOT NULL,
    user_id INT NOT NULL,
    avaliacao VARCHAR(255) NOT NULL,
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(ID) ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TABLE IF EXISTS avaliacoes;
SHOW CREATE TABLE admin;
select * from admin;
desc admin;
ALTER TABLE filmes ADD COLUMN id_funcionario INT;
desc filmes;
ALTER TABLE filmes ADD FOREIGN KEY (id_funcionario) REFERENCES admin(ID);
DELETE FROM admin;

SHOW CREATE TABLE filmes;
SHOW CREATE TABLE pessoas;
ALTER TABLE pessoas DROP FOREIGN KEY pessoas_ibfk_1; 

DROP TABLE IF EXISTS foto_pessoa;
ALTER TABLE filmes DROP FOREIGN KEY filmes_ibfk_2;
DROP TABLE IF EXISTS fotos_filme;    

ALTER TABLE filmes DROP COLUMN foto_id;

alter Table filmes add COLUMN video_id VARCHAR(255);
use adoroFilmes;
alter table pessoas add COLUMN id_image VARCHAR(255);
desc pessoas;  
alter TABLE pessoas DROP COLUMN foto;
alter TABLE pessoas MODIFY COLUMN id_image VARCHAR(255);
ALTER TABLE filmes ADD FOREIGN KEY (Id_funcionario) REFERENCES admin(ID);
alter table pessoas add COLUMN id_video VARCHAR(255);
alter table pessoas drop COLUMN id_video;
desc filmes; 
alter Table filmes add COLUMN id_trailer VARCHAR(255);

USE adoroFilmes;
desc filmes;  
show tables;
desc users;
alter table users MODIFY COLUMN  isverified ENUM('true', 'false'); 

SET FOREIGN_KEY_CHECKS = 1;