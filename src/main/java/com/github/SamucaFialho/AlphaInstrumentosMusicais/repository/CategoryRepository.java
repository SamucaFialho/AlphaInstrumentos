package com.github.SamucaFialho.AlphaInstrumentosMusicais.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long>{
    
}
