#!/usr/bin/env python3
import pandas as pd
import json

def read_excel_file():
    """Read the Excel file with refactored language constants"""
    try:
        # Read the Excel file with the correct filename
        df = pd.read_excel("language_constants/Pratham - Learner App language constent.xlsx")
        
        print("=== EXCEL FILE CONTENTS ===")
        print(f"Shape: {df.shape}")
        print(f"Columns: {list(df.columns)}")
        
        # Show first few rows
        print("\n=== FIRST 10 ROWS ===")
        print(df.head(10))
        
        # Show column info
        print("\n=== COLUMN INFO ===")
        print(df.info())
        
        # Check for any missing values
        print("\n=== MISSING VALUES ===")
        print(df.isnull().sum())
        
        return df
        
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        return None

def main():
    df = read_excel_file()
    
    if df is not None:
        print(f"\nTotal rows: {len(df)}")
        print(f"Total columns: {len(df.columns)}")

if __name__ == "__main__":
    main() 