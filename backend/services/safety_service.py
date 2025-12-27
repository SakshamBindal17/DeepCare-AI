import requests
from functools import lru_cache

class SafetyService:
    def __init__(self):
        self.base_url = "https://api.fda.gov/drug/event.json"

    @lru_cache(maxsize=100)
    def check_drug_risks(self, drug_name, symptom_name):
        """
        Queries FAERS to find the number of reported events for a drug-symptom pair.
        Cached to improve performance on repeated queries.
        """
        if not drug_name or not symptom_name:
            return 0

        # Construct query
        # search=patient.drug.medicinalproduct:{drug}+AND+patient.reaction.reactionmeddrapt:{symptom}
        query = f'patient.drug.medicinalproduct:"{drug_name}" AND patient.reaction.reactionmeddrapt:"{symptom_name}"'
        
        params = {
            'search': query,
            'limit': 1
        }

        try:
            response = requests.get(self.base_url, params=params, timeout=10)
            data = response.json()
            
            if "meta" in data and "results" in data["meta"]:
                return data["meta"]["results"]["total"]
            return 0

        except Exception as e:
            print(f"FAERS API Error: {e}")
            return 0

    def get_drug_profile(self, drug_name):
        """
        Gets common side effects for a drug.
        """
        # Implementation for charts (count by reaction)
        query = f'patient.drug.medicinalproduct:"{drug_name}"'
        params = {
            'search': query,
            'count': 'patient.reaction.reactionmeddrapt.exact'
        }
        
        try:
            response = requests.get(self.base_url, params=params, timeout=10)
            data = response.json()
            if "results" in data:
                return data["results"][:5] # Top 5
            return []
        except Exception as e:
            print(f"FAERS Profile Error: {e}")
            return []
