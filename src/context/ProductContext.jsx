import { createContext, useContext, useState } from "react";

const productContext = createContext();

export const ProductContextProvider = ({ children }) => {
  let [products, setProducts] = useState([]);
  return (
    <productContext.Provider
      value={{
        products,
        createProduct: async (newProduct) => {
          if (
            !newProduct.name ||
            !newProduct.image ||
            !newProduct.price ||
            !newProduct.price
          ) {
            return {
              success: false,
              message: "Please fill in all the fields.",
            };
          }
          const res = await fetch("/api/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
          });
          let result = await res.json();
          setProducts([...products, result]);
          return { success: true, message: "Product created successfully" };
        },

        getProducts: async () => {
          let res = await fetch("https://stellarshop-xos9.onrender.com/api/products", {
            method: "GET",
          });
          let results = await res.json();
          setProducts([...results]);
        },

        deleteProduct: async (id) => {
          let res = await fetch(`/api/products/${id}`, {
            method: "DELETE",
          });
          let result = await res.json();
          if (!result.success) {
            return {
              success: false,
              message: result.message,
            };
          }
          setProducts((currProducts) => {
            return currProducts.filter((product) => {
              return product._id != id;
            });
          });
          return { success: true, message: result.message };
        },

        updateProduct: async(id, updatedProduct) => {
            let res = await fetch(`/api/products/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedProduct),
            });
            let result = await res.json();
            if(result.success!=true) {
                return {
                    success: false,
                    message: result.message,
                  };
            }
            setProducts((currProducts) => {
                return currProducts.map((product) => {
                    return product._id==id?result.data:product;
                });
            });
            return { success: true, message: result.message };
        } 
      }}
    >
      {children}
    </productContext.Provider>
  );
};

export function useProductContext() {
  return useContext(productContext);
}
