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
        Uses weighted scoring system with normalization for 0-10 scale.
        
        Args:
            nlp_entities (list): List of entities from NLP service.
            faers_data (dict, optional): Data from FAERS service. 
                                         Expected format: {'total_reports': int} or similar.
        
        Returns:
            dict: {"score": int, "level": str, "action_plan": str}
        """
        raw_score = 0
        detected_critical = []
        detected_moderate = []
        entity_count = 0

        # 1. Analyze NLP Entities
        for entity in nlp_entities:
            text = entity.get('Text', '').lower()
            category = entity.get('Category', '')
            frequency = entity.get('Frequency', 1)
            entity_count += 1
            
            # Check against critical symptoms (highest priority)
            if any(crit in text for crit in self.CRITICAL_SYMPTOMS):
                raw_score += 4.0 * min(frequency, 2)  # Cap frequency impact
                detected_critical.append(f"{text} (x{frequency})")
            # Check against moderate symptoms
            elif any(mod in text for mod in self.MODERATE_SYMPTOMS):
                raw_score += 2.0 * min(frequency, 2)
                detected_moderate.append(f"{text} (x{frequency})")
            # General medical condition
            elif category == 'MEDICAL_CONDITION':
                raw_score += 0.5 * min(frequency, 3)

        # 2. Analyze FAERS Data (scaled contribution)
        faers_count = 0
        faers_multiplier = 1.0
        if faers_data and isinstance(faers_data, dict):
            faers_count = faers_data.get('total_reports', 0)
            if faers_count > self.HIGH_RISK_THRESHOLD:
                faers_multiplier = 1.5  # 50% increase for high FAERS reports
            elif faers_count > 500:
                faers_multiplier = 1.3  # 30% increase for moderate reports
            elif faers_count > 100:
                faers_multiplier = 1.15  # 15% increase for some reports
        
        # Apply FAERS multiplier to raw score
        raw_score *= faers_multiplier

        # 3. Normalize to 0-10 scale with sigmoid-like curve
        # This prevents score inflation while maintaining sensitivity
        if entity_count == 0:
            final_score = 0
        else:
            # Use logarithmic scaling for better distribution
            # Critical symptoms automatically push score higher
            if detected_critical:
                final_score = min(7 + (raw_score / 5), 10)  # Critical starts at 7+
            elif detected_moderate:
                final_score = min(4 + (raw_score / 4), 9)   # Moderate starts at 4+
            else:
                final_score = min(raw_score / 2, 6)         # General max at 6
        
        # Round to 1 decimal place
        final_score = round(final_score, 1)

        # 4. Determine Level based on score and symptoms
        level = "Low Risk"
        if detected_critical or final_score >= 7:
            level = "Critical"
        elif detected_moderate or final_score >= 4:
            level = "Moderate"
        
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
