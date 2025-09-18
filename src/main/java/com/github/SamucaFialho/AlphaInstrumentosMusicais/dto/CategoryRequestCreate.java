package com.github.SamucaFialho.AlphaInstrumentosMusicais.dto;

import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Category;

public class CategoryRequestCreate {

    private String nome;

    public Category toModel(){
        Category category = new Category();
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
