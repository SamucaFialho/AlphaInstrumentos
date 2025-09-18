package com.github.SamucaFialho.AlphaInstrumentosMusicais.dto;

import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Category;

public class CategoryRequestUpdate {
    
    private String nome;

    public Category toModel(Category category){
        category.setNome(this.nome);
        return category;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
