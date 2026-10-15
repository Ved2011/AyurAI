import axios from "axios";
import { apiUrl } from "./api";

// ----------------------------------------------------------------------------
// Fallback Data Structures (Instant offline performance)
// ----------------------------------------------------------------------------
const FALLBACK_SEASONS = [
  {
    id: "shishira",
    name_sanskrit: "शिशिर ऋतु (Shishira)",
    name_english: "Late Winter / Deep Cold",
    months_hindu: "Magha – Phalguna",
    months_gregorian: "Mid-Jan to Mid-Mar",
    ayana: "Aadana Kaala (Uttarayana)",
    bala: "Pravara (Highest Strength)",
    agni_status: "Tikshna (Intense Agni)",
    dosha_dynamics: { vata: "Sanchaya (Accumulating)", pitta: "Prashama (Pacified)", kapha: "Sanchaya (Freezing in tissues)" },
    classical_citation: "Charaka Samhita Sutrasthana 6:9-18",
    sanskrit_shloka: "शिशिरे शीतमधिकं वातो वृष्ट्याकुलो भवेत्। तस्मात् सर्वं हिमे प्रोक्तं शिशिरेऽपि समाचरेत्॥",
    pathya_ahara: ["Snigdha, warm nourishing foods", "Ghee, sesame oil, whole grains, jaggery", "Milk simmered with dry ginger and saffron"],
    apathya_ahara: ["Cold, raw salads, dry roasted snacks", "Chilled drinks, frozen desserts"],
    pathya_vihara: ["Daily warm oil Abhyanga", "Sunbathing and warm clothing", "Physical exercise up to half capacity"],
  },
  {
    id: "vasanta",
    name_sanskrit: "वसन्त ऋतु (Vasanta)",
    name_english: "Spring / Awakening",
    months_hindu: "Chaitra – Vaishakha",
    months_gregorian: "Mid-Mar to Mid-May",
    ayana: "Aadana Kaala (Uttarayana)",
    bala: "Madhyama (Moderate)",
    agni_status: "Manda (Suppressed by melting Kapha)",
    dosha_dynamics: { vata: "Pacified", pitta: "Normal", kapha: "Prakopa (Aggravated Liquefaction)" },
    classical_citation: "Charaka Samhita Sutrasthana 6:22-26",
    sanskrit_shloka: "वसन्ते भ्रमितभ्रमरे भ्रमरावलिभासुराः। निचितः कफः श्लेष्मा शीतसात्म्यो दिने दिने विलीयते॥",
    pathya_ahara: ["Barley (Yava), roasted moong dal", "Bitter vegetables (karela, neem)", "Honey with warm water, Trikatu spices"],
    apathya_ahara: ["Heavy sweet oily dairy", "Yogurt/curd, fried snacks", "Daytime napping (Diva-swapna)"],
    pathya_vihara: ["Dry powder massage (Udvartana)", "Surya Namaskar & Kapalabhati", "Nasya with Anu Taila"],
  },
  {
    id: "grishma",
    name_sanskrit: "ग्रीष्म ऋतु (Grishma)",
    name_english: "Summer / Solar Heat",
    months_hindu: "Jyeshtha – Ashadha",
    months_gregorian: "Mid-May to Mid-Jul",
    ayana: "Aadana Kaala (Intense Solar Heat)",
    bala: "Alpa (Lowest Strength)",
    agni_status: "Mandagni (Weakened Agni)",
    dosha_dynamics: { vata: "Sanchaya (Accumulating)", pitta: "Prakopa (Aggravating)", kapha: "Pacified" },
    classical_citation: "Charaka Samhita Sutrasthana 6:27-32",
    sanskrit_shloka: "मयूखैर्जगतः स्नेहं ग्रीष्मे पेपीयते रविः। स्वादु शीतं द्रवं स्निग्धमन्नपानं तदा हितम्॥",
    pathya_ahara: ["Coconut water, pomegranate juice, sweet gruels", "Cow's Ghee, cooling melons, cucumber, sweet grapes"],
    apathya_ahara: ["Pungent chilies, alcohol, vinegar, salty pickles", "Strenuous midday workouts"],
    pathya_vihara: ["Moonlight walks, cooling sandalwood mist", "Light cotton white garments", "Short afternoon siesta permitted"],
  },
  {
    id: "varsha",
    name_sanskrit: "वर्षा ऋतु (Varsha)",
    name_english: "Monsoon / Rainy Season",
    months_hindu: "Shravana – Bhadrapada",
    months_gregorian: "Mid-Jul to Mid-Sep",
    ayana: "Visarga Kaala (Dakshinayana)",
    bala: "Alpa to Madhyama",
    agni_status: "Ati Mandagni (Extremely Weakened Agni)",
    dosha_dynamics: { vata: "Prakopa (Severe Aggravation)", pitta: "Sanchaya (Accumulating)", kapha: "Mild congestion" },
    classical_citation: "Charaka Samhita Sutrasthana 6:33-41",
    sanskrit_shloka: "वर्षामु वातो वर्षादिभिराग्नेये चाम्बुसंभवे। अग्निमान्द्यं च लभते तस्मात् संशोधनं हितम्॥",
    pathya_ahara: ["Fresh warm foods seasoned with cumin, hing, and rock salt", "Boiled and cooled herbal ginger water", "Aged grains, light moong soup with ghee"],
    apathya_ahara: ["Raw unboiled water", "Stale leftover food, leafy monsoon greens", "Curd at night"],
    pathya_vihara: ["Fumigating home with Guggulu & Neem", "Warm Abhyanga to calm turbulent Vata", "Basti therapy"],
  },
  {
    id: "sharad",
    name_sanskrit: "शरद् ऋतु (Sharad)",
    name_english: "Autumn / Clear Sun",
    months_hindu: "Ashwina – Kartika",
    months_gregorian: "Mid-Sep to Mid-Nov",
    ayana: "Visarga Kaala (Dakshinayana)",
    bala: "Madhyama (Moderate)",
    agni_status: "Dipta / Teekshna (Rekindling Fire)",
    dosha_dynamics: { vata: "Prashama (Pacified)", pitta: "Prakopa (Severe Flare-Up)", kapha: "Normal" },
    classical_citation: "Charaka Samhita Sutrasthana 6:42-48",
    sanskrit_shloka: "शरत्काले प्रतीते च सहसा सूर्यतापिताः। संचितं पित्तमुदीर्यते तस्मात् तच्छमनं हितम्॥",
    pathya_ahara: ["Basmati rice, green moong, amla, raisins", "Bitter ghee (Tikta Ghrita)", "Hamsodaka water (sun-purified & moon-cooled)"],
    apathya_ahara: ["Spicy, oily, salty, fermented food", "Harsh midday sun exposure", "Sour curd and mustard"],
    pathya_vihara: ["Moonlight bathing (Chandrika Sevana)", "Applying Chandana (sandalwood) paste", "Virechana (purgation detox)"],
  },
  {
    id: "hemanta",
    name_sanskrit: "हेमन्त ऋतु (Hemanta)",
    name_english: "Early Winter / Crisp Frost",
    months_hindu: "Margashirsha – Pausha",
    months_gregorian: "Mid-Nov to Mid-Jan",
    ayana: "Visarga Kaala (Peak Strength)",
    bala: "Pravara (Peak Vitality & Ojas)",
    agni_status: "Jatharagni Balavan (Strongest Fire)",
    dosha_dynamics: { vata: "Controlled by rich diet", pitta: "Pacified", kapha: "Sanchaya (Beginning)" },
    classical_citation: "Charaka Samhita Sutrasthana 6:9-18",
    sanskrit_shloka: "हेमन्ते शीतमधिकं बलं चापि महद् भवेत्। जठरो दीप्यते वह्निर्गुरूणामपि पाचने॥",
    pathya_ahara: ["Hearty rich foods: Ghee, nuts, seeds, jaggery, whole wheat", "Warm spiced milk with nutmeg and dates", "Rasayana formulations (Chyawanprash)"],
    apathya_ahara: ["Fasting or skipping meals", "Dry cold snacks and chilled beverages"],
    pathya_vihara: ["Morning vigorous workouts and wrestling", "Warm oil head and body massage", "Sun exposure"],
  },
];

export async function getRitucharyaData() {
  try {
    const { data } = await axios.get(apiUrl("/classical/ritucharya/all"));
    return data;
  } catch {
    const month = new Date().getMonth();
    const currentIdx = Math.floor(month / 2);
    return {
      current_id: FALLBACK_SEASONS[currentIdx]?.id || "hemanta",
      seasons: FALLBACK_SEASONS,
    };
  }
}

export async function getDravyaGunaHerbs(params = {}) {
  try {
    const { data } = await axios.get(apiUrl("/classical/dravya-guna"), { params });
    return data;
  } catch {
    return {
      total: 8,
      herbs: [
        {
          id: "ashwagandha",
          name_sanskrit: "अश्वगन्धा (Ashwagandha)",
          botanical_name: "Withania somnifera",
          common_names: "Indian Ginseng",
          rasa: ["Tikta", "Kashaya", "Madhura"],
          virya: "Ushna (Hot)",
          vipaka: "Madhura (Sweet)",
          prabhava: "Balya & Rasayana (Ojas Vitalizer)",
          doshakarma: "Vata-Kapha Shamaka",
          indications: ["Anxiety", "Insomnia", "Muscle weakness", "Nervous exhaustion"],
          recommended_dose: "3 - 6g daily with warm milk",
        },
        {
          id: "triphala",
          name_sanskrit: "त्रिफला (Triphala)",
          botanical_name: "Amalaki + Haritaki + Bibhitaki",
          common_names: "Three Sacred Fruits",
          rasa: ["Pancha-Rasa (5 tastes)"],
          virya: "Anushna (Neutral)",
          vipaka: "Madhura",
          prabhava: "Chakshushya & Rasayana",
          doshakarma: "Tridoshahara (Balances Vata, Pitta, Kapha)",
          indications: ["Constipation", "Eye fatigue", "Digestive detox", "Metabolic sluggishness"],
          recommended_dose: "3 - 5g with warm water at bedtime",
        },
        {
          id: "brahmi",
          name_sanskrit: "ब्राह्मी (Brahmi)",
          botanical_name: "Bacopa monnieri",
          common_names: "Herb of Grace",
          rasa: ["Tikta", "Kashaya", "Madhura"],
          virya: "Sheeta (Cooling)",
          vipaka: "Madhura",
          prabhava: "Medhya (Cognitive Enhancer)",
          doshakarma: "Tridosha Shamaka, Pitta-Vata Soother",
          indications: ["Memory loss", "Mental exhaustion", "Restless focus", "Hypertension"],
          recommended_dose: "2 - 5g daily with ghee or honey",
        },
        {
          id: "tulsi",
          name_sanskrit: "तुलसी (Tulsi)",
          botanical_name: "Ocimum sanctum",
          common_names: "Holy Basil",
          rasa: ["Katu", "Tikta"],
          virya: "Ushna (Hot)",
          vipaka: "Katu (Pungent)",
          prabhava: "Hridya & Bhutaghni (Cardio-Respiratory Protector)",
          doshakarma: "Kapha-Vata Shamaka",
          indications: ["Cough", "Bronchial cold", "Sinusitis", "Low immunity"],
          recommended_dose: "1 - 3g with raw honey or herbal tea",
        },
      ],
    };
  }
}

export async function getAgniAmaQuiz() {
  try {
    const { data } = await axios.get(apiUrl("/classical/agni-ama/quiz"));
    return data;
  } catch {
    return {
      total_questions: 5,
      questions: [
        {
          id: "appetite_pattern",
          question: "How would you describe your hunger pattern?",
          options: [
            { index: 0, text: "Sharp, intense, can't tolerate delayed meals (Pitta)" },
            { index: 1, text: "Fluctuating & erratic; ravenous one day, zero appetite the next (Vata)" },
            { index: 2, text: "Sluggish, can skip easily, feel full and heavy after small meals (Kapha)" },
            { index: 3, text: "Predictable, comfortable, digests within 4 hours cleanly (Balanced)" },
          ],
        },
        {
          id: "tongue_coating",
          question: "Upon waking, what coating is visible on your tongue?",
          options: [
            { index: 0, text: "Clean, pink, moist with negligible coating" },
            { index: 1, text: "Dry, slightly brownish or crackled coating at back" },
            { index: 2, text: "Yellowish coating with warm bitter morning taste" },
            { index: 3, text: "Thick, white, greasy, pasty coating" },
          ],
        },
      ],
    };
  }
}

export async function evaluateAgniAma(answers) {
  try {
    const { data } = await axios.post(apiUrl("/classical/agni-ama/evaluate"), { answers });
    return data;
  } catch {
    return {
      primary_agni: "Visham Agni (Irregular Digestive Fire)",
      agni_type: "visham",
      dosha_association: "Vata Dosha Aggravation",
      pathophysiology: "Erratic digestive heat caused by turbulent Vata.",
      ama_percentage: 35,
      ama_status: "Alpa-Ama (Mild Endotoxin Accumulation)",
      dipana_pachana_therapy: "Sip warm ginger-cumin tea 15 minutes before meals; eat on a fixed schedule.",
      ama_remediation: "Avoid eating past 8:00 PM and avoid cold drinks.",
    };
  }
}

export async function getNidraPlan(dosha = "vata") {
  try {
    const { data } = await axios.get(apiUrl("/classical/nidra/plan"), { params: { dosha } });
    return data;
  } catch {
    return {
      dosha_protocol: {
        dosha: "Vata Sleep Protocol",
        sleep_archetype: "Light, easily awakened, prone to early morning racing thoughts.",
        optimal_sleep_duration: "8 hours",
        ideal_bedtime: "09:45 PM",
        ideal_waketime: "06:00 AM",
        classical_therapy: "Padabhyanga (warm sesame oil foot massage before bed).",
        herbal_tonic: "Warm milk with Ashwagandha and a pinch of nutmeg.",
      },
    };
  }
}

export async function calculateNidraSynergy(payload) {
  try {
    const { data } = await axios.post(apiUrl("/classical/nidra/calculate"), payload);
    return data;
  } catch {
    return {
      duration_hours: 8,
      is_kapha_kaala_bedtime: true,
      ojas_conservation_score: 85,
      recommendation: "Restful alignment with Kapha Kaala.",
    };
  }
}

export async function getHomeRemedies(search = "") {
  try {
    const { data } = await axios.get(apiUrl("/classical/remedies"), { params: { search } });
    return data;
  } catch {
    return {
      total: 3,
      remedies: [
        {
          id: "amlapitta",
          ailment_sanskrit: "अम्लपित्त (Amlapitta)",
          ailment_english: "Hyperacidity & Heartburn",
          remedy_title: "Coriander & Fennel Cold Infusion (Dhanya-Mishreya Hima)",
          ingredients: ["1 tbsp Coriander seeds", "1 tbsp Fennel seeds", "2 cups water", "1 tsp Rock sugar"],
          preparation: "Steep crushed seeds in room-temperature water overnight. Strain and sip on empty stomach.",
          clinical_mechanism: "Coriander's cooling astringency neutralizes gastric fire without slowing Agni.",
        },
        {
          id: "pratishyaya",
          ailment_sanskrit: "प्रतिश्याय (Pratishyaya)",
          ailment_english: "Cough, Cold & Nasal Congestion",
          remedy_title: "Golden Turmeric Ginger Honey Kashaya",
          ingredients: ["1/2 tsp Turmeric", "1/2 inch grated Ginger", "3 crushed Black Peppercorns", "1 tsp raw honey"],
          preparation: "Boil spices in water for 5 minutes. Cool until lukewarm, then stir in honey.",
          clinical_mechanism: "Hot pungent virya liquefies and expels sinus phlegm.",
        },
      ],
    };
  }
}
