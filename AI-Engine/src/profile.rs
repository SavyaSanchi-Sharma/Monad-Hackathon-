use std::{env};
use pyo3::{
    types::{PyDict, PyModule, PyAnyMethods, PyDictMethods},
    Python, PyErr
};
use serde::{Serialize, Deserialize};
use serde_json::Value;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Gender {
    Male,
    Female,
    NonBinary,
    Other(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Location {
    city: String,
    country: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum RelationshipGoal {
    Casual,
    Serious,
    Friendship,
    Other(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Preferences {
    preferred_age_range: (u8, u8),
    preferred_genders: Vec<Gender>,
    relationship_goal: RelationshipGoal,
}

impl Preferences {
    pub fn validate(&self) -> Result<(), String> {
        let (min, max) = self.preferred_age_range;
        if min >= max {
            return Err("Minimum age must be less than maximum age".to_string());
        }
        if min < 18 {
            return Err("Minimum age must be at least 18".to_string());
        }
        Ok(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Profile {
    pub id: u64,
    pub name: String,
    pub age: u8,
    pub gender: Gender,
    pub location: Location,
    pub interests: Vec<String>,
    pub preferences: Preferences,
}

#[derive(Debug)]
pub enum MatchError {
    PyError(PyErr),
    SerializationError(serde_json::Error),
    RuntimeError(String),
}

impl std::fmt::Display for MatchError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            MatchError::PyError(err) => write!(f, "Python error: {}", err),
            MatchError::SerializationError(err) => write!(f, "Serialization error: {}", err),
            MatchError::RuntimeError(err) => write!(f, "Runtime error: {}", err),
        }
    }
}

impl std::error::Error for MatchError {}

impl Profile {
    pub fn get_preferences(&self) -> &Preferences {
        &self.preferences
    }

    #[allow(deprecated)]
    pub async fn match_with(&self, other: &Profile) -> Result<f32, String> {
        Python::with_gil(|py| {
            // Import the llm module
            let sys = py.import("sys").map_err(|e| e.to_string())?;
            let path = sys.getattr("path").map_err(|e| e.to_string())?;
            
            let current_dir = env::current_dir()
                .map_err(|e| e.to_string())?;
            let py_path = current_dir.join("pythonFiles");
            
            if !py_path.exists() {
                return Err(format!("Python files directory not found at: {}", py_path.display()));
            }
            
            let py_path_str = py_path.to_str()
                .ok_or_else(|| "Invalid path encoding".to_string())?;
            
            // Add pythonFiles to Python path if not already there
            path.call_method1("append", (py_path_str,))
                .map_err(|e| e.to_string())?;

            // Convert profiles to JSON strings
            let profile_a_json = serde_json::to_string(self)
                .map_err(|e| e.to_string())?;
            let profile_b_json = serde_json::to_string(other)
                .map_err(|e| e.to_string())?;
            
            // Create Python dictionary and add profiles
            let locals = PyDict::new(py);
            locals.set_item("profile_a", profile_a_json)
                .map_err(|e| format!("Failed to set profile_a: {}", e))?;
            locals.set_item("profile_b", profile_b_json)
                .map_err(|e| format!("Failed to set profile_b: {}", e))?;

            // Import and call the Python function
            let llm = py.import("llm")
                .map_err(|e| format!("Failed to import llm module: {}", e))?;
            
            let result: f32 = llm.call_method1("match_profiles", (locals,))
                .map_err(|e| format!("Failed to call Python function: {}", e))?
                .extract()
                .map_err(|e| format!("Failed to extract result: {}", e))?;

            if !(1.0..=10.0).contains(&result) {
                return Err("Score must be between 1 and 10".to_string());
            }

            Ok(result)
        })
    }
}

impl Default for Location {
    fn default() -> Self {
        Self {
            city: String::new(),
            country: String::new(),
        }
    }
}

impl Default for Preferences {
    fn default() -> Self {
        Self {
            preferred_age_range: (18, 99),
            preferred_genders: Vec::new(),
            relationship_goal: RelationshipGoal::Friendship,
        }
    }
}