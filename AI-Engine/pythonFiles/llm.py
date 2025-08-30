import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

load_dotenv('project.env')
genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-2.5-flash')

def match_profiles(locals_dict):
    """
    Match two profiles from the provided dictionary.
    
    Args:
        locals_dict: Dictionary containing 'profile_a' and 'profile_b' as JSON strings
    Returns:
        float: Match score between 1 and 10
    """
    try:
        # Parse the JSON strings into dictionaries
        profile_a = json.loads(locals_dict["profile_a"])
        profile_b = json.loads(locals_dict["profile_b"])

        prompt = f"""
You are a matchmaker AI. Given the following two dating profiles, determine if they are a good match and provide a score from 1 to 10.

Profile A:
- Age: {profile_a.get('age')}
- Gender: {profile_a.get('gender')}
- Location: {profile_a['location']['city']}, {profile_a['location']['country']}
- Interests: {', '.join(profile_a['interests'])}
- Relationship Goal: {profile_a['preferences']['relationship_goal']}

Profile B:
- Age: {profile_b.get('age')}
- Gender: {profile_b.get('gender')}
- Location: {profile_b['location']['city']}, {profile_b['location']['country']}
- Interests: {', '.join(profile_b['interests'])}
- Relationship Goal: {profile_b['preferences']['relationship_goal']}

Analyze their compatibility and return a score from 1 to 10.
Respond in the following format:
{{"Score": <score>}}
"""
        response = model.generate_content(prompt).text
        score = float(response.split('"Score":')[1].split('}')[0].strip())
        return max(1.0, min(10.0, score))
    except Exception as e:
        print(f"Error in match_profiles: {str(e)}")
        return 5.0  # Default middle score in case of error


