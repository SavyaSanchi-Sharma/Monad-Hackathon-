use actix_web::{web, HttpResponse, Responder};
use ai_engine::Profile;
use crate::AppState;
use ethers::prelude::*;

pub async fn match_profiles(
    profiles: web::Json<(Profile, Profile)>,
    state: web::Data<AppState>,
) -> impl Responder {
    let (profile_a, profile_b) = profiles.into_inner();
    
    // Get AI match score
    let score = match state.ai_matcher.match_profiles(&profile_a, &profile_b).await {
        Ok(score) => score,
        Err(e) => return HttpResponse::InternalServerError().json(format!("AI matching failed: {}", e)),
    };
    
    // Record on blockchain
    let score_scaled = (score * 100.0) as u64;
    match state.contract.record_match(
        profile_a.address,
        profile_b.address,
        score_scaled,
    ).await {
        Ok(_) => HttpResponse::Ok().json(json!({
            "score": score,
            "blockchain_tx": "success"
        })),
        Err(e) => HttpResponse::InternalServerError().json(format!("Blockchain transaction failed: {}", e)),
    }
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/match")
            .route(web::post().to(match_profiles))
    );
}