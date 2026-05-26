import { useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../services/api";

const RecipeCard = ({ recipe }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden recipe-card-shadow flex flex-col h-full border border-outline-variant/10 group transition-all duration-300">
      <Link to={`/recipe/${recipe.id || 1}`} className="relative h-56 overflow-hidden block">
        <img
          alt={recipe.name || recipe.title}
          src={getImageUrl(recipe.images?.[0] || recipe.image || recipe.cover_image_url || recipe.coverImageUrl) || "https://lh3.googleusercontent.com/aida-public/AB6AXuB6hAYWu85lEEG9woz8LQ78yLJjOx2n3-6LxQmkOAk75hdoTJjrj-qk-kUo7Vw7r2oODMiMjSbG_NKZ-FM5d5hihHOlert2sWBqpvyKb5LZkdKzNqNaIDS20jcqtQYLxQ1T_jd1fz2_kzMNCzdw40Z7tWHj7sH82uMO3jEgC1qYB4OC7pqxO0qwQaV9-2xHX-1DWeLZfqbpAF6VQQ1I96j-3pa7pYJzxqemDJHg7AllTPuaVk8bRQ0d1msjX88SZQ27QdIIHI7riw"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Cook Time Banner */}
        {(recipe.cookTime || recipe.cook_time_minutes !== undefined || recipe.cookTimeMinutes !== undefined) && (
          <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full text-label-sm font-label-sm text-on-surface flex items-center shadow-sm select-none">
            <span className="material-symbols-outlined text-sm mr-1">timer</span> {recipe.cookTime || `${(recipe.prep_time_minutes || recipe.prepTimeMinutes || 0) + (recipe.cook_time_minutes || recipe.cookTimeMinutes || 0)} phút`}
          </div>
        )}
        
        {/* Category Tag */}
        {(recipe.category || (recipe.categories && recipe.categories.length > 0)) && (
          <div className="absolute top-4 left-4 bg-tertiary-fixed/90 backdrop-blur-sm text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-label-sm font-label-sm shadow-sm select-none">
            {recipe.category || (typeof recipe.categories?.[0] === 'object' ? recipe.categories[0].name : recipe.categories?.[0])}
          </div>
        )}
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex gap-2 mb-3">
          {(recipe.tags || (recipe.categories && recipe.categories.length > 0)) && (recipe.tags || recipe.categories).slice(0, 2).map((tag, idx) => (
            <span key={idx} className="px-3 py-0.5 bg-tertiary/10 text-tertiary rounded-full text-label-sm font-label-sm">
              {typeof tag === 'object' ? tag.name : tag}
            </span>
          ))}
          {recipe.difficulty && (
            <span className="px-3 py-0.5 bg-secondary/10 text-secondary rounded-full text-label-sm font-label-sm">
              {recipe.difficulty}
            </span>
          )}
        </div>
        
        <Link to={`/recipe/${recipe.id || 1}`} className="block">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {recipe.name || recipe.title}
          </h3>
        </Link>
        
        {recipe.description && (
          <p className="text-body-md text-on-surface-variant line-clamp-2 mb-4">
            {recipe.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/10">
          <div className="flex items-center gap-2">
            {recipe.authorImage || recipe.authorAvatar || recipe.author_avatar ? (
              <div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden border border-outline-variant/20">
                <img
                  alt={recipe.author || recipe.author_name || "Chef"}
                  src={getImageUrl(recipe.authorImage || recipe.authorAvatar || recipe.author_avatar)}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <span className="material-symbols-outlined text-secondary text-2xl">account_circle</span>
            )}
            <span className="text-label-sm font-label-sm text-on-surface-variant">
              {recipe.author || recipe.author_name || "Chef CulinShare"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {(recipe.rating !== undefined || recipe.average_rating !== undefined || recipe.averageRating !== undefined) && (
              <div className="flex items-center gap-xs select-none">
                <span className="material-symbols-outlined text-yellow-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-label-md text-label-md text-on-surface">
                  {parseFloat(recipe.rating || recipe.average_rating || recipe.averageRating || 0).toFixed(1)}
                </span>
              </div>
            )}
            <button
              onClick={handleLikeClick}
              className={`material-symbols-outlined text-outline hover:text-primary transition-colors p-1 hover:bg-surface-container-low rounded-full ${isLiked ? "text-primary" : "text-secondary"}`}
              style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
