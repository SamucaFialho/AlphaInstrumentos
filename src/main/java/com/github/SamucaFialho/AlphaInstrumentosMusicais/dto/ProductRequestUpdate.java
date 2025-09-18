package com.github.SamucaFialho.AlphaInstrumentosMusicais.dto;

import java.math.BigDecimal;
import java.util.List;

import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Product;

public class ProductRequestUpdate {

     private BigDecimal price;
     private Integer quantidade;
     private List<Long> categoriasIds;

    public Product toModel(Product product){
        product.setPrice(this.price);
        product.setQuantidade(this.quantidade);
        return product;
    }


    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }


    public Integer getQuantidade() {
        return quantidade;
    }


    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }


    public List<Long> getCategoriasIds() {
        return categoriasIds;
    }


    public void setCategoriasIds(List<Long> categoriasIds) {
        this.categoriasIds = categoriasIds;
    }
    
}
