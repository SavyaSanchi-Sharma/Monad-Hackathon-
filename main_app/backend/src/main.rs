use actix_web::{web, App, HttpServer, middleware::Logger};
use actix_cors::Cors;
use std::collections::HashMap;
use std::sync::Mutex;
use ai_engine::profile::Profile;
use dotenv::dotenv;

// State handler
#[allow(dead_code)] // Suppress warning since profiles is used in api.rs
pub struct AppState {
    profiles: Mutex<HashMap<u64, Profile>>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load environment variables
    dotenv().ok();
    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));

    println!("Server running at http://localhost:8080");

    // Create app state
    let app_state = web::Data::new(AppState {
        profiles: Mutex::new(HashMap::new()),
    });

    // Start server
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .wrap(Logger::default())
            .app_data(app_state.clone())
            .configure(ai_engine::api::config_routes)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}