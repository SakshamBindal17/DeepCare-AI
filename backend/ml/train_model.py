"""
Quick ML Model Training - Minimal Version
Train a simple Random Forest on FAERS data
"""
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
import pandas as pd
import joblib
import os

def train_quick_model():
    """Train a minimal ML model quickly"""
    
    # Load data
    print("📊 Loading training data...")
    df = pd.read_csv('../analysis/results/training_data.csv')
    print(f"   Loaded {len(df)} samples")
    
    # Encode categorical features
    print("\n🔧 Encoding features...")
    le_drug = LabelEncoder()
    le_symptom = LabelEncoder()
    
    df['drug_encoded'] = le_drug.fit_transform(df['drug'])
    df['symptom_encoded'] = le_symptom.fit_transform(df['symptom'])
    
    # Features and labels
    X = df[['drug_encoded', 'symptom_encoded', 'faers_reports']]
    y = df['label']
    
    print(f"   Features: {list(X.columns)}")
    print(f"   Classes: {y.unique()}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"\n✂️  Train/Test split:")
    print(f"   Training: {len(X_train)} samples")
    print(f"   Testing: {len(X_test)} samples")
    
    # Train model
    print("\n🎯 Training Random Forest...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight='balanced'
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    print("\n📈 Evaluating model...")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n✅ Accuracy: {accuracy:.2%}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Low', 'Moderate', 'Critical']))
    
    # Save model and encoders
    print("\n💾 Saving model artifacts...")
    os.makedirs('../models', exist_ok=True)
    
    joblib.dump(model, '../models/risk_classifier.pkl')
    joblib.dump(le_drug, '../models/drug_encoder.pkl')
    joblib.dump(le_symptom, '../models/symptom_encoder.pkl')
    
    print("   ✓ Saved risk_classifier.pkl")
    print("   ✓ Saved drug_encoder.pkl")
    print("   ✓ Saved symptom_encoder.pkl")
    
    # Feature importance
    print("\n🔍 Feature Importance:")
    for feat, imp in zip(X.columns, model.feature_importances_):
        print(f"   {feat}: {imp:.3f}")
    
    return model, accuracy

if __name__ == '__main__':
    model, acc = train_quick_model()
    print(f"\n🎉 Training complete! Model accuracy: {acc:.2%}")
