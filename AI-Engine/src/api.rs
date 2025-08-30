use actix_web::{web, HttpResponse, Responder};
use serde_json::json;
use crate::profile::Profile;
use std::sync::Mutex;
use std::collections::HashMap;

pub struct AppState {
    profiles: Mutex<HashMap<u64, Profile>>,
}

// Create a new profile
pub async fn create_profile(
    data: web::Json<Profile>,
    state: web::Data<AppState>,
) -> impl Responder {
    let mut profiles = state.profiles.lock().unwrap();
    let profile = data.into_inner();
    
    if profiles.contains_key(&profile.id) {
        return HttpResponse::Conflict().json(json!({
            "error": "Profile already exists"
        }));
    }

    profiles.insert(profile.id, profile.clone());
    HttpResponse::Created().json(profile)
}

// Match with another profile
pub async fn match_profiles(
    profiles: web::Json<(Profile, Profile)>,
    _state: web::Data<AppState>,
) -> impl Responder {
    let (profile_a, profile_b) = profiles.into_inner();
    
    match profile_a.match_with(&profile_b).await {
        Ok(score) => HttpResponse::Ok().json(json!({
            "score": score,
            "profile_a_id": profile_a.id,
            "profile_b_id": profile_b.id
        })),
        Err(e) => HttpResponse::InternalServerError().json(json!({
            "error": e
        }))
    }
}

pub fn config_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .service(web::resource("/profiles")
                .route(web::post().to(create_profile)))
            .service(web::resource("/match")
                .route(web::post().to(match_profiles)))
    );
}