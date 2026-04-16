#!/usr/bin/env python3
"""
CineSignal Backend API Testing Suite
Tests all endpoints for the Film Demand Intelligence Platform
"""

import requests
import sys
import json
from datetime import datetime

class CineSignalAPITester:
    def __init__(self, base_url="https://pensive-panini-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else f"{self.api_url}/"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)

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
        """Test API health check"""
        success, response = self.run_test(
            "API Health Check",
            "GET",
            "",
            200
        )
        if success:
            version = response.get('version', 'unknown')
            total_movies = response.get('total_movies', 0)
            print(f"   Version: {version}, Movies: {total_movies}")
            return version == "2.0.0" and total_movies > 0
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
    print("🎬 CineSignal Backend API Testing Suite")
    print("=" * 50)
    
    tester = CineSignalAPITester()
    
    # Run all tests
    test_results = {
        "Health Check (v2.0.0)": tester.test_health_check(),
        "Film Simulation": tester.test_simulation(),
        "Director Presets (10)": tester.test_director_presets(),
        "Case Studies (5)": tester.test_case_studies(),
        "Concept Comparison": tester.test_concept_comparison(),
        "Feedback System": tester.test_feedback_submission(),
        "Genre Analytics": tester.test_genre_analytics(),
        "Regional Analytics": tester.test_regional_analytics(),
        "Top Movies": tester.test_top_movies(),
        "Director Testing": tester.test_director_testing(),
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