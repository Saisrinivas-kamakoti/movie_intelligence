#!/usr/bin/env python3
"""
CineSignal v3.0 Backend API Testing Suite
Tests all endpoints for the Film Demand Intelligence Platform
Including authentication and workspace features
"""

import requests
import sys
import json
import uuid
from datetime import datetime

class CineSignalAPITester:
    def __init__(self, base_url="https://pensive-panini-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.session_token = None
        self.test_user_email = f"test.user.{int(datetime.now().timestamp())}@example.com"

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else f"{self.api_url}/"
        headers = {'Content-Type': 'application/json'}
        
        # Add auth header if required and available
        if auth_required and self.session_token:
            headers['Authorization'] = f'Bearer {self.session_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    "test": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test API health check - should show 700 movies"""
        success, response = self.run_test(
            "API Health Check (v3.0 - 700 movies)",
            "GET",
            "",
            200
        )
        if success:
            version = response.get('version', 'unknown')
            total_movies = response.get('total_movies', 0)
            print(f"   Version: {version}, Movies: {total_movies}")
            return total_movies == 700
        return False

    def test_stats_endpoint(self):
        """Test stats endpoint - should show 12 languages"""
        success, response = self.run_test(
            "Stats Endpoint (12 languages)",
            "GET",
            "stats",
            200
        )
        if success:
            lang_dist = response.get('language_distribution', {})
            total_movies = response.get('total_movies', 0)
            print(f"   Total movies: {total_movies}")
            print(f"   Languages found: {len(lang_dist)}")
            print(f"   Languages: {list(lang_dist.keys())}")
            return len(lang_dist) == 12 and total_movies == 700
        return False

    def test_metadata_endpoint(self):
        """Test metadata endpoint - should include new regional languages"""
        success, response = self.run_test(
            "Metadata Endpoint (12 languages)",
            "GET",
            "metadata",
            200
        )
        if success:
            languages = response.get('languages', [])
            required_langs = ["Punjabi", "Gujarati", "Assamese", "Odia", "Marathi", "Bengali", "Malayalam"]
            print(f"   Languages: {languages}")
            has_required = all(lang in languages for lang in required_langs)
            return len(languages) == 12 and has_required
        return False

    def test_auth_register(self):
        """Test user registration with email/password"""
        register_data = {
            "email": self.test_user_email,
            "password": "TestPassword123!",
            "name": "Test User"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=register_data
        )
        
        if success:
            user_id = response.get('user_id')
            email = response.get('email')
            auth_type = response.get('auth_type')
            print(f"   User ID: {user_id}")
            print(f"   Email: {email}")
            print(f"   Auth Type: {auth_type}")
            return user_id is not None and email == self.test_user_email and auth_type == "email"
        return False

    def test_auth_login(self):
        """Test user login with email/password"""
        login_data = {
            "email": self.test_user_email,
            "password": "TestPassword123!"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success:
            user_id = response.get('user_id')
            email = response.get('email')
            print(f"   Logged in user: {email}")
            # Note: session token is set via cookie, not returned in response
            return user_id is not None and email == self.test_user_email
        return False

    def test_auth_me_without_token(self):
        """Test /auth/me without authentication - should return 401"""
        success, response = self.run_test(
            "Auth Me (No Token)",
            "GET",
            "auth/me",
            401
        )
        return success

    def test_auth_me_with_token(self):
        """Test /auth/me with valid session token"""
        # First login to get session token
        login_data = {
            "email": self.test_user_email,
            "password": "TestPassword123!"
        }
        
        try:
            # Login and capture session token from cookie
            url = f"{self.api_url}/auth/login"
            response = requests.post(url, json=login_data, timeout=30)
            
            if response.status_code == 200:
                # Extract session token from Set-Cookie header
                cookies = response.cookies
                session_token = cookies.get('session_token')
                if session_token:
                    self.session_token = session_token
                    print(f"   Session token captured: {session_token[:20]}...")
                    
                    # Now test /auth/me with the token
                    success, response = self.run_test(
                        "Auth Me (With Token)",
                        "GET",
                        "auth/me",
                        200,
                        auth_required=True
                    )
                    
                    if success:
                        email = response.get('email')
                        user_id = response.get('user_id')
                        print(f"   Authenticated user: {email}")
                        return email == self.test_user_email and user_id is not None
                    return False
                else:
                    print("   ❌ No session token in response cookies")
                    return False
            else:
                print(f"   ❌ Login failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"   ❌ Error during auth test: {str(e)}")
            return False

    def test_auth_logout(self):
        """Test user logout"""
        success, response = self.run_test(
            "User Logout",
            "POST",
            "auth/logout",
            200,
            auth_required=True
        )
        
        if success:
            message = response.get('message', '')
            print(f"   Logout message: {message}")
            return 'logged out' in message.lower()
        return False

    def test_workspace_simulations_unauthorized(self):
        """Test workspace simulations without auth - should return 401"""
        success, response = self.run_test(
            "Workspace Simulations (No Auth)",
            "GET",
            "workspace/simulations",
            401
        )
        return success

    def test_workspace_save_simulation(self):
        """Test saving a simulation to workspace"""
        simulation_data = {
            "title": "Test Action Drama",
            "concept": {
                "genres": ["Action", "Drama"],
                "tone": "Dramatic",
                "budget_tier": "Medium (30-100Cr)",
                "release_type": "Theatrical",
                "language": "Hindi",
                "star_power": 7,
                "novelty_factor": 6,
                "family_appeal": 8
            },
            "prediction": {
                "overall_score": 75.5,
                "neural_network": {"nn_score": 78.2},
                "roi_estimate": {"estimated_roi_pct": 45}
            },
            "notes": "Test simulation for workspace"
        }
        
        success, response = self.run_test(
            "Save Simulation to Workspace",
            "POST",
            "workspace/simulations",
            200,
            data=simulation_data,
            auth_required=True
        )
        
        if success:
            sim_id = response.get('sim_id')
            message = response.get('message', '')
            print(f"   Simulation ID: {sim_id}")
            return sim_id is not None and 'saved' in message.lower()
        return False

    def test_workspace_create_note(self):
        """Test creating a note in workspace"""
        note_data = {
            "title": "Test Note",
            "content": "This is a test note for the workspace",
            "category": "testing"
        }
        
        success, response = self.run_test(
            "Create Workspace Note",
            "POST",
            "workspace/notes",
            200,
            data=note_data,
            auth_required=True
        )
        
        if success:
            note_id = response.get('note_id')
            message = response.get('message', '')
            print(f"   Note ID: {note_id}")
            return note_id is not None and 'created' in message.lower()
        return False

    def test_workspace_dashboard(self):
        """Test workspace dashboard"""
        success, response = self.run_test(
            "Workspace Dashboard",
            "GET",
            "workspace/dashboard",
            200,
            auth_required=True
        )
        
        if success:
            user_info = response.get('user', {})
            counts = response.get('counts', {})
            print(f"   User: {user_info.get('email')}")
            print(f"   Simulations: {counts.get('simulations', 0)}")
            print(f"   Notes: {counts.get('notes', 0)}")
            return user_info.get('email') == self.test_user_email
        return False

    def test_simulation(self):
        """Test film concept simulation"""
        concept = {
            "genres": ["Action", "Drama"],
            "tone": "Dramatic",
            "budget_tier": "Medium (30-100Cr)",
            "release_type": "Theatrical",
            "language": "Hindi",
            "star_power": 7,
            "novelty_factor": 6,
            "family_appeal": 8
        }
        
        success, response = self.run_test(
            "Film Concept Simulation",
            "POST",
            "simulate",
            200,
            data=concept
        )
        
        if success:
            required_fields = ['overall_score', 'neural_network', 'roi_estimate']
            has_all_fields = all(field in response for field in required_fields)
            print(f"   Overall Score: {response.get('overall_score', 'N/A')}")
            print(f"   NN Score: {response.get('neural_network', {}).get('nn_score', 'N/A')}")
            print(f"   ROI: {response.get('roi_estimate', {}).get('estimated_roi_pct', 'N/A')}%")
            return has_all_fields
        return False

    def test_director_presets(self):
        """Test director presets endpoint"""
        success, response = self.run_test(
            "Director Presets",
            "GET",
            "directors/presets",
            200
        )
        
        if success:
            presets = response.get('presets', [])
            total = response.get('total', 0)
            print(f"   Found {total} director presets")
            return total == 10 and len(presets) == 10
        return False

    def test_case_studies(self):
        """Test case studies endpoint"""
        success, response = self.run_test(
            "Case Studies",
            "GET",
            "case-studies",
            200
        )
        
        if success:
            case_studies = response.get('case_studies', [])
            total = response.get('total', 0)
            print(f"   Found {total} case studies")
            return total == 5 and len(case_studies) == 5
        return False

    def test_concept_comparison(self):
        """Test concept comparison"""
        concepts = [
            {
                "genres": ["Action", "Thriller"],
                "tone": "Action-Packed",
                "budget_tier": "High (100Cr+)",
                "release_type": "Theatrical",
                "language": "Hindi",
                "star_power": 9,
                "novelty_factor": 7,
                "family_appeal": 6
            },
            {
                "genres": ["Drama", "Romance"],
                "tone": "Emotional",
                "budget_tier": "Medium (30-100Cr)",
                "release_type": "Hybrid",
                "language": "Hindi",
                "star_power": 6,
                "novelty_factor": 8,
                "family_appeal": 9
            }
        ]
        
        success, response = self.run_test(
            "Concept Comparison",
            "POST",
            "compare",
            200,
            data={"concepts": concepts}
        )
        
        if success:
            comparisons = response.get('comparisons', [])
            print(f"   Compared {len(comparisons)} concepts")
            return len(comparisons) == 2 and all('rank' in comp for comp in comparisons)
        return False

    def test_feedback_submission(self):
        """Test feedback submission"""
        feedback_data = {
            "concept": {
                "genres": ["Action"],
                "tone": "Action-Packed",
                "budget_tier": "Medium (30-100Cr)",
                "release_type": "Theatrical",
                "language": "Hindi",
                "star_power": 7,
                "novelty_factor": 6,
                "family_appeal": 7
            },
            "prediction": {
                "overall_score": 75.5,
                "label": "Strong Commercial Viability"
            },
            "rating": 4,
            "comments": "Good prediction accuracy"
        }
        
        success, response = self.run_test(
            "Feedback Submission",
            "POST",
            "feedback",
            200,
            data=feedback_data
        )
        
        if success:
            feedback_id = response.get('feedback_id')
            print(f"   Feedback ID: {feedback_id}")
            return feedback_id is not None
        return False

    def test_genre_analytics(self):
        """Test genre performance analytics"""
        success, response = self.run_test(
            "Genre Performance Analytics",
            "GET",
            "analytics/genre-performance",
            200
        )
        
        if success:
            data = response.get('data', [])
            total_genres = response.get('total_genres', 0)
            print(f"   Found {total_genres} genres with performance data")
            return total_genres > 0 and len(data) > 0
        return False

    def test_regional_analytics(self):
        """Test regional analytics"""
        success, response = self.run_test(
            "Regional Analytics",
            "GET",
            "analytics/regional",
            200
        )
        
        if success:
            data = response.get('data', [])
            total_regions = response.get('total_regions', 0)
            print(f"   Found {total_regions} regions with data")
            return total_regions > 0 and len(data) > 0
        return False

    def test_top_movies(self):
        """Test top movies endpoint"""
        success, response = self.run_test(
            "Top Movies",
            "GET",
            "movies/top",
            200,
            params={"limit": 10}
        )
        
        if success:
            movies = response.get('top_movies', [])
            metric = response.get('metric', '')
            print(f"   Found {len(movies)} top movies (metric: {metric})")
            return len(movies) > 0
        return False

    def test_director_testing(self):
        """Test director testing with Rajamouli preset"""
        success, response = self.run_test(
            "Director Testing - Rajamouli",
            "POST",
            "directors/test/rajamouli_epic",
            200
        )
        
        if success:
            director = response.get('director', '')
            prediction = response.get('prediction', {})
            print(f"   Director: {director}")
            print(f"   Prediction Score: {prediction.get('overall_score', 'N/A')}")
            return director == "S.S. Rajamouli" and 'overall_score' in prediction
        return False

    def test_pdf_export(self):
        """Test PDF export functionality"""
        concept = {
            "genres": ["Action", "Drama"],
            "tone": "Dramatic",
            "budget_tier": "High (100Cr+)",
            "release_type": "Theatrical",
            "language": "Hindi",
            "star_power": 8,
            "novelty_factor": 7,
            "family_appeal": 8
        }
        
        try:
            url = f"{self.api_url}/export/pitch-deck"
            response = requests.post(url, json=concept, timeout=30)
            
            self.tests_run += 1
            print(f"\n🔍 Testing PDF Export...")
            
            if response.status_code == 200 and response.headers.get('content-type') == 'application/pdf':
                self.tests_passed += 1
                print(f"✅ Passed - PDF generated successfully")
                print(f"   Content-Type: {response.headers.get('content-type')}")
                print(f"   Content-Length: {len(response.content)} bytes")
                return True
            else:
                print(f"❌ Failed - Status: {response.status_code}, Content-Type: {response.headers.get('content-type')}")
                self.failed_tests.append({
                    "test": "PDF Export",
                    "endpoint": "export/pitch-deck",
                    "expected": "200 + PDF",
                    "actual": f"{response.status_code} + {response.headers.get('content-type')}"
                })
                return False
                
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": "PDF Export",
                "endpoint": "export/pitch-deck",
                "error": str(e)
            })
            return False

def main():
    print("🎬 CineSignal v3.0 Backend API Testing Suite")
    print("=" * 50)
    
    tester = CineSignalAPITester()
    
    # Run all tests in order
    test_results = {
        # Core API tests
        "Health Check (700 movies)": tester.test_health_check(),
        "Stats Endpoint (12 languages)": tester.test_stats_endpoint(),
        "Metadata Endpoint (12 languages)": tester.test_metadata_endpoint(),
        "Film Simulation (NN + ROI)": tester.test_simulation(),
        
        # Authentication tests
        "User Registration": tester.test_auth_register(),
        "User Login": tester.test_auth_login(),
        "Auth Me (No Token)": tester.test_auth_me_without_token(),
        "Auth Me (With Token)": tester.test_auth_me_with_token(),
        
        # Workspace tests (require auth - test before logout)
        "Workspace Unauthorized": tester.test_workspace_simulations_unauthorized(),
        "Save Simulation": tester.test_workspace_save_simulation(),
        "Create Note": tester.test_workspace_create_note(),
        "Workspace Dashboard": tester.test_workspace_dashboard(),
        
        # Logout test (after workspace tests)
        "User Logout": tester.test_auth_logout(),
        
        # Legacy features (should still work)
        "Director Presets (10)": tester.test_director_presets(),
        "Case Studies (5)": tester.test_case_studies(),
        "PDF Export": tester.test_pdf_export()
    }
    
    # Print summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    for test_name, passed in test_results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print(f"\nOverall: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.failed_tests:
        print("\n❌ FAILED TESTS DETAILS:")
        for failure in tester.failed_tests:
            error_msg = failure.get('error', f"Expected {failure.get('expected')}, got {failure.get('actual')}")
            print(f"  • {failure['test']}: {error_msg}")
    
    # Return exit code
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())