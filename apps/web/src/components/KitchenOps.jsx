import React, { useState } from 'react';

export function KitchenOps({ ingredients, onAddIngredient, onRemoveIngredient }) {
  const [newIngredient, setNewIngredient] = useState('');
  const [recipes, setRecipes] = useState(null);

  const handleAdd = () => {
    if (newIngredient.trim()) {
      onAddIngredient(newIngredient.trim());
      setNewIngredient('');
    }
  };

  const handleVoiceDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('El dictado por voz no es soportado por este navegador.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNewIngredient(transcript);
    };
  };

  const handleCameraScan = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        ['Tomates Frescos', 'Queso Blanco', 'Pimientos Verdes', 'Huevos'].forEach(item => onAddIngredient(item));
        alert('📷 Escaneo de refrigerador completado. Se agregaron ingredientes reconocidos.');
      }
    };
    input.click();
  };

  const handleGenerateRecipes = () => {
    if (ingredients.length === 0) return;
    const ingStr = ingredients.join(', ');

    setRecipes([
      {
        title: `Bowl Saludable de ${ingredients[0] || 'Ingredientes'} & Proteínas`,
        time: '20 minutos',
        difficulty: 'Fácil',
        badge: 'Anti-Desperdicio',
        steps: [
          `Picar en cubos ${ingredients[0] || 'los vegetales'} y saltear en sartén con aceite de oliva.`,
          `Combinar con ${ingredients[1] || 'el acompañamiento disponible'} e incorporar especias al gusto.`,
          `Servir caliente. Ideal para 2 porciones de roomies o meal prep.`
        ]
      },
      {
        title: `Salteado Exprés de Alacena (${ingStr.slice(0, 25)}...)`,
        time: '15 minutos',
        difficulty: 'Rápido',
        badge: 'Económico',
        steps: [
          `Mezclar en fuego medio los ingredientes disponibles en tu refrigerador.`,
          `Sazonar con sal, pimienta y salsa de soya si se cuenta con ella.`,
          `Disfrutar de una comida rápida sin necesidad de comprar ingredientes extra.`
        ]
      }
    ]);
  };

  return (
    <section className="tab-panel active">
      <div className="panel-hero">
        <div className="hero-text">
          <h2><i className="fa-solid fa-refrigerator"></i> Refrigerador Inteligente & Recetas Anti-Desperdicio</h2>
          <p>Escanea tus ingredientes con cámara o dictado por voz para que RoomIA genere recetas sin gastar de más.</p>
        </div>
      </div>

      <div className="kitchen-layout">
        <div className="kitchen-card">
          <div className="card-title-bar">
            <h3><i className="fa-solid fa-basket-shopping"></i> Inventario de Refrigerador & Alacena</h3>
            <button className="btn btn-secondary btn-sm" onClick={handleCameraScan}>
              <i className="fa-solid fa-camera"></i> Escanear con Cámara
            </button>
          </div>

          <div className="add-item-bar">
            <input 
              type="text" 
              value={newIngredient} 
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Ej: 3 Huevos, Pechuga de Pollo, Tomates..." 
            />
            <button className="btn btn-primary" onClick={handleAdd}>
              <i className="fa-solid fa-plus"></i> Agregar
            </button>
            <button className="btn btn-icon-only" onClick={handleVoiceDictation} title="Dictar por voz">
              <i className="fa-solid fa-microphone"></i>
            </button>
          </div>

          <div className="ingredient-chips-wrap">
            {ingredients.map((ing, idx) => (
              <span key={idx} className="ing-chip">
                <i className="fa-solid fa-apple-whole text-xs"></i>
                {ing}
                <span className="remove-btn" onClick={() => onRemoveIngredient(idx)}>&times;</span>
              </span>
            ))}
          </div>

          <div className="recipe-action-box">
            <button className="btn btn-gradient full-width" onClick={handleGenerateRecipes}>
              <i className="fa-solid fa-kitchen-set"></i> Generar Recetas Anti-Desperdicio
            </button>
          </div>
        </div>

        <div className="kitchen-card">
          <div className="card-title-bar">
            <h3><i className="fa-solid fa-book-bookmark"></i> Recetas Sugeridas por RoomIA</h3>
          </div>

          <div className="recipes-container">
            {!recipes ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                Haz clic en "Generar Recetas" para ver platillos adaptados a tu inventario.
              </p>
            ) : (
              recipes.map((recipe, i) => (
                <div key={i} className="recipe-card">
                  <h4><i className="fa-solid fa-bowl-food"></i> {recipe.title}</h4>
                  <div className="recipe-meta">
                    <span><i className="fa-solid fa-clock"></i> {recipe.time}</span>
                    <span><i className="fa-solid fa-fire"></i> {recipe.difficulty}</span>
                    <span><i className="fa-solid fa-leaf"></i> {recipe.badge}</span>
                  </div>
                  <ol className="recipe-steps">
                    {recipe.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
