import { useState, useEffect } from "react";
import { API_URL } from "./api";

// Saare ProductCards ek hi baar categories / subcategories fetch karte hain
// (shared cache), 21 cards = 21 requests nahi.
const createLoader = (path) => {
  let cache = null;
  let inflight = null;

  const load = () => {
    if (cache) return Promise.resolve(cache);

    if (!inflight) {
      inflight = fetch(`${API_URL}${path}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch ${path}`);
          return res.json();
        })
        .then((data) => {
          cache = data;
          return data;
        })
        .catch((err) => {
          console.error(`Fetch ${path} error:`, err);
          inflight = null;
          return [];
        });
    }

    return inflight;
  };

  const invalidate = () => {
    cache = null;
    inflight = null;
  };

  const useData = () => {
    const [data, setData] = useState(cache || []);

    useEffect(() => {
      let alive = true;

      load().then((d) => {
        if (alive) setData(d);
      });

      return () => {
        alive = false;
      };
    }, []);

    return data;
  };

  return { invalidate, useData };
};

const categoriesLoader = createLoader("/api/categories");
const subcategoriesLoader = createLoader("/api/subcategories");

// Admin mein category / subcategory save hone ke baad call karo, taaki
// website par naya text turant dikhe (bina page refresh ke).
export const invalidateCategories = categoriesLoader.invalidate;
export const invalidateSubcategories = subcategoriesLoader.invalidate;

export const useSubcategories = subcategoriesLoader.useData;

export default categoriesLoader.useData;