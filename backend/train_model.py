"""Train Neural Network model on movie dataset"""
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from movie_dataset import MOVIE_DATA
from neural_network_model import CineSignalNeuralNet
import os

def encode_movie(movie):
    """Encode a movie into feature vector"""
    genres_list = [
        "Action", "Drama", "Comedy", "Thriller", "Romance",
        "Horror", "Sci-Fi", "Fantasy", "Crime", "Mystery",
        "Family", "Musical", "Historical", "Biographical", "Social"
    ]
    tones_list = ["Dark", "Light", "Dramatic", "Action-Packed", "Emotional", "Suspenseful", "Humorous"]
    languages_list = ["Hindi", "Tamil", "Telugu", "Malayalam", "Kannada", "English", "Bengali", "Marathi"]
    
    features = np.zeros(50)
    
    # Genre encoding (15 features)
    for genre in movie.get("genres", []):
        if genre in genres_list:
            features[genres_list.index(genre)] = 1.0
    
    # Tone encoding (7 features, offset 15)
    tone = movie.get("tone", "Dramatic")
    if tone in tones_list:
        features[15 + tones_list.index(tone)] = 1.0
    
    # Budget encoding (3 features, offset 22)
    budget_map = {"Low (<30Cr)": 0, "Medium (30-100Cr)": 1, "High (100Cr+)": 2}
    budget_idx = budget_map.get(movie.get("budget_tier", "Medium (30-100Cr)"), 1)
    features[22 + budget_idx] = 1.0
    
    # Release type (3 features, offset 25)
    release_map = {"Theatrical": 0, "OTT": 1, "Hybrid": 2}
    release_idx = release_map.get(movie.get("release_type", "Theatrical"), 0)
    features[25 + release_idx] = 1.0
    
    # Language encoding (8 features, offset 28)
    language = movie.get("language", "Hindi")
    if language in languages_list:
        features[28 + languages_list.index(language)] = 1.0
    
    # Numerical features (offset 36)
    features[36] = movie.get("star_power", 5) / 10.0
    features[37] = movie.get("novelty_factor", 5) / 10.0
    ta = movie.get("target_audience", [])
    features[38] = len(ta) / 4.0 if isinstance(ta, list) else 0.5
    
    # Interaction features
    features[39] = len(movie.get("genres", [])) / 3.0
    features[40] = 1.0 if "Action" in movie.get("genres", []) else 0.0
    features[41] = 1.0 if "Drama" in movie.get("genres", []) else 0.0
    
    indian_langs = ["Hindi", "Tamil", "Telugu", "Malayalam", "Kannada", "Bengali", "Marathi"]
    features[42] = 1.0 if movie.get("language") in indian_langs else 0.0
    features[43] = 1.0 if (movie.get("budget_tier") == "High (100Cr+)" and "Action" in movie.get("genres", [])) else 0.0
    
    return features

def train_model():
    """Train the neural network"""
    print("Preparing training data...")
    
    X = []
    y = []
    
    for movie in MOVIE_DATA:
        features = encode_movie(movie)
        X.append(features)
        y.append(movie["combined_score"] / 100.0)  # Normalize to 0-1
    
    X = np.array(X, dtype=np.float32)
    y = np.array(y, dtype=np.float32).reshape(-1, 1)
    
    # Split data
    split_idx = int(len(X) * 0.8)
    X_train, X_val = X[:split_idx], X[split_idx:]
    y_train, y_val = y[:split_idx], y[split_idx:]
    
    # Convert to tensors
    X_train_t = torch.FloatTensor(X_train)
    y_train_t = torch.FloatTensor(y_train)
    X_val_t = torch.FloatTensor(X_val)
    y_val_t = torch.FloatTensor(y_val)
    
    # Create model
    model = CineSignalNeuralNet(input_size=50, hidden_size=128)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001, weight_decay=1e-5)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=20, factor=0.5)
    
    # Train
    print("Training neural network...")
    best_val_loss = float('inf')
    patience_counter = 0
    
    for epoch in range(500):
        model.train()
        optimizer.zero_grad()
        outputs = model(X_train_t)
        loss = criterion(outputs, y_train_t)
        loss.backward()
        optimizer.step()
        
        # Validation
        model.eval()
        with torch.no_grad():
            val_outputs = model(X_val_t)
            val_loss = criterion(val_outputs, y_val_t)
        
        scheduler.step(val_loss)
        
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
            # Save best model
            os.makedirs("/app/backend/models", exist_ok=True)
            torch.save(model.state_dict(), "/app/backend/models/neural_net.pth")
        else:
            patience_counter += 1
        
        if patience_counter >= 50:
            print(f"Early stopping at epoch {epoch}")
            break
        
        if (epoch + 1) % 50 == 0:
            print(f"Epoch {epoch+1}: Train Loss={loss.item():.4f}, Val Loss={val_loss.item():.4f}")
    
    # Final evaluation
    model.load_state_dict(torch.load("/app/backend/models/neural_net.pth"))
    model.eval()
    
    with torch.no_grad():
        train_pred = model(X_train_t).numpy() * 100
        val_pred = model(X_val_t).numpy() * 100
        train_actual = y_train * 100
        val_actual = y_val * 100
    
    train_mae = np.mean(np.abs(train_pred - train_actual))
    val_mae = np.mean(np.abs(val_pred - val_actual))
    
    print(f"\nTraining complete!")
    print(f"Train MAE: {train_mae:.2f}")
    print(f"Validation MAE: {val_mae:.2f}")
    print(f"Model saved to /app/backend/models/neural_net.pth")
    
    return model

if __name__ == "__main__":
    train_model()
