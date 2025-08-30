
pub mod api;
pub mod profile;
use profile::Profile;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::future_to_promise;
use js_sys::Promise;

#[wasm_bindgen]
#[derive(Clone)]
pub struct MatchResult {
    score: f32,
    error_msg: Option<String>,
}

#[wasm_bindgen]
impl MatchResult {
    #[wasm_bindgen(constructor)]
    pub fn new(score: f32, error_msg: Option<String>) -> MatchResult {
        MatchResult { score, error_msg }
    }

    #[wasm_bindgen(getter)]
    pub fn score(&self) -> f32 {
        self.score
    }

    #[wasm_bindgen(getter)]
    pub fn error(&self) -> Option<String> {
        self.error_msg.clone()
    }
}

#[wasm_bindgen]
pub struct ProfileMatcher {
    user_profile: Profile,
}

#[wasm_bindgen]
impl ProfileMatcher {
    #[wasm_bindgen(constructor)]
    pub fn new(profile_json: &str) -> Result<ProfileMatcher, JsValue> {
        let user_profile: Profile = serde_json::from_str(profile_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid profile format: {}", e)))?;
        
        Ok(ProfileMatcher { user_profile })
    }

    #[wasm_bindgen]
    pub fn match_with(&self, other_profile_json: &str) -> Promise {
        let user_profile = self.user_profile.clone();
        let other_profile_json = other_profile_json.to_string(); // Clone to String for 'static lifetime
        
        let future = async move {
            let other_profile: Profile = serde_json::from_str(&other_profile_json)
                .map_err(|e| JsValue::from_str(&format!("Invalid profile format: {}", e)))?;
            match user_profile.match_with(&other_profile).await {
                Ok(score) => Ok(JsValue::from(MatchResult::new(score, None))),
                Err(e) => Ok(JsValue::from(MatchResult::new(0.0, Some(e)))),
            }
        };
        future_to_promise(future)
    }

    #[wasm_bindgen]
    pub fn validate_profile(profile_json: &str) -> Result<bool, JsValue> {
        let profile: Profile = serde_json::from_str(profile_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid profile format: {}", e)))?;
        
        match profile.get_preferences().validate() {
            Ok(_) => Ok(true),
            Err(e) => Err(JsValue::from_str(&e)),
        }
    }
}