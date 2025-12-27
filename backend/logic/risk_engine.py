class RiskEngine:
    def __init__(self):
        self.CRITICAL_SYMPTOMS = [
            "chest pain", "anaphylaxis", "shortness of breath", 
            "difficulty breathing", "stroke", "heart attack", 
            "severe bleeding", "loss of consciousness", "suicidal thoughts"
        ]
        self.MODERATE_SYMPTOMS = [
            "rash", "vomiting", "dizziness", "nausea", 
            "fever", "headache", "diarrhea", "palpitations"
        ]
        self.HIGH_RISK_THRESHOLD = 1000  # FAERS report count threshold

    def calculate_risk(self, nlp_entities, faers_data=None):
        """
        Calculates risk score based on NLP entities and FAERS data.
        
        Args:
            nlp_entities (list): List of entities from NLP service.
            faers_data (dict, optional): Data from FAERS service. 
                                         Expected format: {'total_reports': int} or similar.
        
        Returns:
            dict: {"score": int, "level": str, "action_plan": str}
        """
        score = 0
        detected_critical = []
        detected_moderate = []

        # 1. Analyze NLP Entities
        for entity in nlp_entities:
            text = entity.get('Text', '').lower()
            category = entity.get('Category', '')
            frequency = entity.get('Frequency', 1)
            
            # Check against lists
            if any(crit in text for crit in self.CRITICAL_SYMPTOMS):
                score += 10 * frequency
                detected_critical.append(f"{text} (x{frequency})")
            elif any(mod in text for mod in self.MODERATE_SYMPTOMS):
                score += 5 * frequency
                detected_moderate.append(f"{text} (x{frequency})")
            
            # General Medical Condition bump
            if category == 'MEDICAL_CONDITION':
                score += 1 * frequency

        # 2. Analyze FAERS Data
        faers_count = 0
        if faers_data and isinstance(faers_data, dict):
            faers_count = faers_data.get('total_reports', 0)
            if faers_count > self.HIGH_RISK_THRESHOLD:
                score += 5  # Significant bump for high FAERS reports
            elif faers_count > 100:
                score += 2

        # 3. Determine Level
        # Cap score at 10 for normalization if needed, but logic depends on thresholds
        # Let's define levels:
        # Critical: Score >= 10 OR any critical symptom
        # Moderate: Score >= 5
        # Low: Score < 5

        level = "Low Risk"
        if detected_critical or score >= 10:
            level = "Critical"
            score = max(score, 10) # Ensure score reflects severity (at least 10)
        elif detected_moderate or score >= 5:
            level = "Moderate"
        
        # Cap score at 10 for UI consistency (0-10 scale)
        final_score = min(score, 10)
        
        # 4. Generate Action Plan
        action_plan = self._generate_action_plan(level, detected_critical, detected_moderate, faers_count)

        return {
            "score": final_score,
            "level": level,
            "action_plan": action_plan,
            "details": {
                "critical_symptoms": detected_critical,
                "moderate_symptoms": detected_moderate,
                "faers_reports": faers_count
            }
        }

    def _generate_action_plan(self, level, critical, moderate, faers_count):
        if level == "Critical":
            symptoms = ", ".join(critical)
            return (f"CRITICAL ALERT: Detected {symptoms}. "
                    f"Immediate medical attention required. "
                    f"FAERS data indicates {faers_count} related reports. "
                    "Advise patient to go to ER immediately.")
        elif level == "Moderate":
            symptoms = ", ".join(moderate)
            return (f"WARNING: Detected {symptoms}. "
                    f"Monitor closely. FAERS reports: {faers_count}. "
                    "Consult a doctor if symptoms persist or worsen.")
        else:
            return ("Low risk detected. Continue monitoring. "
                    "Adhere to prescribed dosage and report any new symptoms.")
