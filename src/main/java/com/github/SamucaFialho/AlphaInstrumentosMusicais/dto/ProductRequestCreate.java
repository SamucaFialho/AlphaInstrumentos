package com.github.SamucaFialho.AlphaInstrumentosMusicais.dto;

import java.math.BigDecimal;
import java.util.List;

import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Product;

import jakarta.validation.constraints.NotBlank;

public class ProductRequestCreate {

    @NotBlank
    private String name;

    private Integer quantidade;
    private BigDecimal price;
    private String imageUrl;
    private String description;
    private List<Long> categoriasIds;


    public Product toModel(){
        Product product = new Product();
        product.setName(this.name);
        product.setPrice(this.price);
        product.setDescription(this.description);
        product.setQuantidade(this.quantidade);
        product.setImageUrl(this.imageUrl);
        return product;
    }

    public String getImageUrl() {
		return imageUrl;
	}


	 public void setImageUrl(String imageUrl) {
		 this.imageUrl = imageUrl;
	 }


	 public String getDescription() {
		 return description;
	 }


	 public void setDescription(String description) {
		 this.description = description;
	 }


	public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
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
