/**
 * ============================================================================
 * Classical Ayurvedic Features Engine (आयुर्वेद शास्त्र संहिता प्रज्ञा)
 * ============================================================================
 * Grounded in:
 * 1. Charaka Samhita (Sutrasthana 6, 21, 26, 27; Vimanasthana 6, 8)
 * 2. Astanga Hridaya (Sutrasthana 1, 3, 7; Nidanasthana 12)
 * 3. Sushruta Samhita (Sutrasthana 20, 24)
 * 4. Bhavaprakasha Nighantu & Bhaishajya Ratnavali
 *
 * 5 Canonical Modules:
 * - Module 1: Ritucharya (ऋतुचर्या) — Seasonal Living & Dietetics Calendar
 * - Module 2: Dravya Guna (द्रव्यगुण) — Classical Ayurvedic Materia Medica & Herbology
 * - Module 3: Agni & Ama Pariksha (अग्नि एवं आम परीक्षा) — Metabolic Fire & Endotoxin Diagnostic
 * - Module 4: Nidra Vidhi (निद्रा विधि) — Circadian Sleep & Ojas Restoration
 * - Module 5: Pathya & Gharelu Upachar (घरेलू उपचार एवं पथ्यापथ्य) — Classical Home Remedies
 */

// ============================================================================
// MODULE 1: RITUCHARYA (ऋतुचर्या) — 6 Classical Seasons
// ============================================================================
const RITUS = [
  {
    id: "shishira",
    name_sanskrit: "शिशिर ऋतु (Shishira)",
    name_english: "Late Winter / Deep Cold",
    months_hindu: "Magha – Phalguna",
    months_gregorian: "Mid-January to Mid-March",
    ayana: "Aadana Kaala (Northern Solstice / Uttarayana)",
    predominant_rasa: "Tikta (Bitter)",
    predominant_mahabhuta: "Vayu + Akasha (Air + Ether)",
    bala: "Pravara (Highest Physical Strength & Immunity)",
    agni_status: "Tikshna / Utkrishta (Intensely High Digestive Agni)",
    dosha_dynamics: {
      vata: "Sanchaya (Vata accumulates subtly due to coldness)",
      pitta: "Prashama (Pitta remains pacified)",
      kapha: "Chaya / Sanchaya (Kapha freezes and accumulates in bodily tissues)",
    },
    classical_citation: "Charaka Samhita Sutrasthana 6:9-18 & Astanga Hridaya Sutrasthana 3:8-17",
    sanskrit_shloka: "शिशिरे शीतमधिकं वातो वृष्ट्याकुलो भवेत्। तस्मात् सर्वं हिमे प्रोक्तं शिशिरेऽपि समाचरेत्॥",
    pathya_ahara: [
      "Heavy, unctuous, warm nourishing foods (Snigdha, Guru, Ushna).",
      "Ghee, sesame oil, whole grains (wheat, black gram/urad dal), sugarcane products (guda/jaggery).",
      "Milk simmered with dry ginger and saffron; warm soups flavored with digestive spices.",
      "Predominance of Madhura (Sweet), Amla (Sour), and Lavana (Salty) tastes.",
    ],
    apathya_ahara: [
      "Cold, raw salads, dry roasted snacks (Ruksha ahara).",
      "Vata-aggravating light foods (puffed rice, barley without ghee, bitter leafy greens without fat).",
      "Chilled drinks, frozen desserts, cold water.",
    ],
    pathya_vihara: [
      "Daily full-body warm sesame oil massage (Abhyanga) followed by warm herbal bath (Snana).",
      "Sunbathing (Atapa Sevana) and residing in warm, insulated chambers (Ushna Griha).",
      "Wearing warm woolen garments; vigorous physical exercise (Vyayama) up to half capacity (Ardhashakti).",
    ],
    seasonal_panchakarma: "Mild snehana (oleation) and swedana (sudation); preparation for Spring detox.",
  },
  {
    id: "vasanta",
    name_sanskrit: "वसन्त ऋतु (Vasanta)",
    name_english: "Spring / Awakening",
    months_hindu: "Chaitra – Vaishakha",
    months_gregorian: "Mid-March to Mid-May",
    ayana: "Aadana Kaala (Uttarayana)",
    predominant_rasa: "Kashaya (Astringent)",
    predominant_mahabhuta: "Prithvi + Vayu (Earth + Air)",
    bala: "Madhyama (Moderate Strength)",
    agni_status: "Manda (Suppressed Digestive Agni due to melting Kapha)",
    dosha_dynamics: {
      vata: "Normal / Pacified",
      pitta: "Normal",
      kapha: "Prakopa (Violent Kapha Aggravation / Liquefaction)",
    },
    classical_citation: "Charaka Samhita Sutrasthana 6:22-26 & Astanga Hridaya Sutrasthana 3:18-25",
    sanskrit_shloka: "वसन्ते भ्रमितभ्रमरे भ्रमरावलिभासुराः। निचितः कफः श्लेष्मा शीतसात्म्यो दिने दिने विलीयते॥",
    pathya_ahara: [
      "Light, easily digestible, warm and dry grains: Aged barley (Yava), wheat, roasted moong dal.",
      "Bitter vegetables (karela/bitter gourd, neem flowers, methi/fenugreek).",
      "Honey (Madhu) mixed in lukewarm water to scrape excess liquefying Kapha.",
      "Digestive spices: Ginger (Shunthi), black pepper (Maricha), long pepper (Pippali) — Trikatu.",
      "Predominance of Katu (Pungent), Tikta (Bitter), and Kashaya (Astringent) tastes.",
    ],
    apathya_ahara: [
      "Heavy, sweet, cold, oily foods (Guru, Snigdha, Madhura, Sheeta).",
      "Yogurt/curd (Dadhi), unctuous buffalo milk, fried snacks, ice creams.",
      "Daytime napping (Diva-swapna) — strictly forbidden as it precipitates acute Kapha disease.",
    ],
    pathya_vihara: [
      "Dry powder massage (Udvartana) with triphala or chickpea flour to liquefy subcutaneous fat and Kapha.",
      "Brisk walking, yogic sun salutations (Surya Namaskar), vigorous pranayama (Bhastrika, Kapalabhati).",
      "Nasya (nasal oil drops with Anu Taila) to clear head and sinus mucus.",
    ],
    seasonal_panchakarma: "Vamana Karma (Therapeutic Emesis) — the gold-standard classical cleansing for spring.",
  },
  {
    id: "grishma",
    name_sanskrit: "ग्रीष्म ऋतु (Grishma)",
    name_english: "Summer / Intense Heat",
    months_hindu: "Jyeshtha – Ashadha",
    months_gregorian: "Mid-May to Mid-July",
    ayana: "Aadana Kaala (Intense Sun Drying Nature's Moisture)",
    predominant_rasa: "Katu (Pungent)",
    predominant_mahabhuta: "Agni + Vayu (Fire + Air)",
    bala: "Alpa (Lowest Physical Strength & Vitality)",
    agni_status: "Mandagni (Weakened Agni due to somatic heat dispersion)",
    dosha_dynamics: {
      vata: "Chaya / Sanchaya (Vata accumulates due to dryness and depletion)",
      pitta: "Prakopa (Pitta escalates due to external solar heat)",
      kapha: "Prashama (Kapha is pacified and dried)",
    },
    classical_citation: "Charaka Samhita Sutrasthana 6:27-32 & Astanga Hridaya Sutrasthana 3:26-41",
    sanskrit_shloka: "मयूखैर्जगतः स्नेहं ग्रीष्मे पेपीयते रविः। स्वादु शीतं द्रवं स्निग्धमन्नपानं तदा हितम्॥",
    pathya_ahara: [
      "Cooling, sweet, liquid, hydrating foods: Rice with milk, cooling sweet gruels (Mantha).",
      "Coconut water, fresh pomegranate juice, grape juices, amla sherbet with rock sugar.",
      "Cucumber, bottle gourd (Lauki), watermelon, sweet ripe mangoes with milk.",
      "Pure Cow's Ghee (Ghrita) to protect tissues against desiccating summer sun.",
    ],
    apathya_ahara: [
      "Pungent, sour, salty, heating foods (Katu, Amla, Lavana, Ushna).",
      "Chilies, vinegar, alcohol, fermented pickles, mustard, excessive tea and coffee.",
      "Heavy strenuous workouts in peak sun; dry hot saunas.",
    ],
    pathya_vihara: [
      "Resting in cool, shaded spaces with cooling sandalwood (Chandana) and khus (Usheera) mist.",
      "Light daytime rest (Diva-swapna is permitted ONLY in Grishma due to short nights and dehydration).",
      "Moonlight walks (Sheetala Chandrika), wearing light breathable white linen or cotton.",
    ],
    seasonal_panchakarma: "Sheetali & Sheetakari pranayama; soothing basti with medicated milk (Ksheera Basti).",
  },
  {
    id: "varsha",
    name_sanskrit: "वर्षा ऋतु (Varsha)",
    name_english: "Monsoon / Rainy Season",
    months_hindu: "Shravana – Bhadrapada",
    months_gregorian: "Mid-July to Mid-September",
    ayana: "Visarga Kaala (Southern Solstice / Dakshinayana - Cooling Begins)",
    predominant_rasa: "Amla (Sour)",
    predominant_mahabhuta: "Prithvi + Agni (Earth + Fire)",
    bala: "Alpa to Madhyama (Gradually Recovering)",
    agni_status: "Ati Mandagni (Extremely Weakened Digestive Agni due to dampness & clouds)",
    dosha_dynamics: {
      vata: "Prakopa (Severe Vata Aggravation due to damp cold and wind)",
      pitta: "Sanchaya (Pitta accumulates due to sour water and humidity)",
      kapha: "Normal to mild congestion",
    },
    classical_citation: "Charaka Samhita Sutrasthana 6:33-41 & Astanga Hridaya Sutrasthana 3:42-50",
    sanskrit_shloka: "वर्षामु वातो वर्षादिभिराग्नेये चाम्बुसंभवे। अग्निमान्द्यं च लभते तस्मात् संशोधनं हितम्॥",
    pathya_ahara: [
      "Warm, freshly cooked, light foods with a dash of ghee and rock salt.",
      "Old grains (Purana Shali, Purana Yava), moong dal soup seasoned with cumin, coriander, and hing.",
      "Boiled and cooled water (Kashaya / boiled with ginger or dry coriander).",
      "Small amounts of pure honey in warm preparations to dispel dampness.",
    ],
    apathya_ahara: [
      "Raw unboiled water (causes water-borne toxins and Jaladosha).",
      "Stale foods, river fish, leafy greens (rich in insects and ungrounded dampness in rains).",
      "Heavy puddings, curd at night, unboiled raw salads.",
    ],
    pathya_vihara: [
      "Fumigating living quarters with fragrant herbs (Guggulu, Agaru, Neem leaves).",
      "Keeping feet and skin dry; avoiding wading through muddy water.",
      "Warm oil massage (Abhyanga) to calm turbulent monsoon Vata.",
    ],
    seasonal_panchakarma: "Asthapana & Anuvasana Basti (Medicated Herbal Enema) — the premier therapy for Vata.",
  },
  {
    id: "sharad",
    name_sanskrit: "शरद् ऋतु (Sharad)",
    name_english: "Autumn / Clear Skies & Bright Sun",
    months_hindu: "Ashwina – Kartika",
    months_gregorian: "Mid-September to Mid-November",
    ayana: "Visarga Kaala (Dakshinayana)",
    predominant_rasa: "Lavana (Salty)",
    predominant_mahabhuta: "Ap + Agni (Water + Fire)",
    bala: "Madhyama (Moderate)",
    agni_status: "Dipta / Teekshna (Sharp rekindling Agni)",
    dosha_dynamics: {
      vata: "Prashama (Vata is pacified by warm soothing autumn sun)",
      pitta: "Prakopa (Violent Pitta Aggravation due to sudden direct sun rays)",
      kapha: "Normal / Pacified",
    },
    classical_citation: "Charaka Samhita Sutrasthana 6:42-48 & Astanga Hridaya Sutrasthana 3:51-58",
    sanskrit_shloka: "शरत्काले प्रतीते च सहसा सूर्यतापिताः। संचितं पित्तमुदीर्यते तस्मात् तच्छमनं हितम्॥",
    pathya_ahara: [
      "Sweet, bitter, and astringent foods (Madhura, Tikta, Kashaya).",
      "Basmati rice, green gram (moong dal), bottle gourd, ridge gourd, amla, raisins.",
      "Medicated ghee (Tikta Ghrita - ghee infused with bitter herbs like neem and patola).",
      "Hamsodaka water (purified by autumn sun during day and cooled by autumn moon rays at night).",
    ],
    apathya_ahara: [
      "Pungent, sour, fermented, hot, salty foods (mustard, red chilies, vinegar, sour curd).",
      "Direct exposure to harsh afternoon sun; excessive oil or fried foods.",
      "Day sleep and night awakenings.",
    ],
    pathya_vihara: [
      "Evening walks bathed in the soothing autumn moonbeams (Chandrika Sevana).",
      "Wearing pearl ornaments, garlands of white fragrant flowers (Jasmine/Mogra).",
      "Applying soothing pastes of Chandana (sandalwood) and Khus on the skin.",
    ],
    seasonal_panchakarma: "Virechana Karma (Therapeutic Purgation) & Raktamokshana (Bloodletting) for Pitta disorders.",
  },
  {
    id: "hemanta",
    name_sanskrit: "हेमन्त ऋतु (Hemanta)",
    name_english: "Early Winter / Cold Crisp Frost",
    months_hindu: "Margashirsha – Pausha",
    months_gregorian: "Mid-November to Mid-January",
    ayana: "Visarga Kaala (Dakshinayana - Earthly Energy & Strength Reaches Peak)",
    predominant_rasa: "Madhura (Sweet)",
    predominant_mahabhuta: "Prithvi + Ap (Earth + Water)",
    bala: "Pravara / Utkrishta (Maximum Human Strength & Ojas)",
    agni_status: "Jatharagni Balavan (Strongest Digestive Fire of the Year)",
    dosha_dynamics: {
      vata: "Controlled / Pacified by rich unctuous diet",
      pitta: "Pacified",
      kapha: "Sanchaya (Beginning of Kapha accumulation)",
    },
    classical_citation: "Charaka Samhita Sutrasthana 6:9-18 & Astanga Hridaya Sutrasthana 3:8-17",
    sanskrit_shloka: "हेमन्ते शीतमधिकं बलं चापि महद् भवेत्। जठरो दीप्यते वह्निर्गुरूणामपि पाचने॥",
    pathya_ahara: [
      "Dense, nourishing, sweet, sour, salty foods: Ghee, nuts, seeds, sesame, jaggery (Guda).",
      "Hearty soups of lentils, root vegetables, warm fresh milk with nutmeg and dates.",
      "Warm herbal decoctions with ginger, cinnamon, and holy basil.",
      "Fermented restorative tonics (Asavas and Arishtas) like Draksharishta.",
    ],
    apathya_ahara: [
      "Fasting or skipping meals (Agni is so strong it will consume body tissues if unfed - Dhatu Kshaya).",
      "Cold beverages, raw salads, dry popcorn, cold drafts.",
    ],
    pathya_vihara: [
      "Daily morning Abhyanga with warm sesame or mustard oil, head massage (Shiroabhyanga).",
      "Strenuous physical workouts, wrestling, strength training to harness peak winter strength.",
      "Sunbathing and resting in well-insulated chambers.",
    ],
    seasonal_panchakarma: "Rasayana therapy (Rejuvenation therapies like Chyawanprash, Ashwagandha Rasayana).",
  },
];

/**
 * Determine the current Ayurvedic Ritu based on Gregorian date
 */
function getCurrentRitu(date = new Date()) {
  const month = date.getMonth(); // 0 = Jan, 11 = Dec
  const day = date.getDate();

  // Mapping approximate dates:
  // Jan 15 - Mar 14: Shishira
  // Mar 15 - May 14: Vasanta
  // May 15 - Jul 14: Grishma
  // Jul 15 - Sep 14: Varsha
  // Sep 15 - Nov 14: Sharad
  // Nov 15 - Jan 14: Hemanta
  if ((month === 0 && day >= 15) || month === 1 || (month === 2 && day < 15)) return RITUS[0]; // Shishira
  if ((month === 2 && day >= 15) || month === 3 || (month === 4 && day < 15)) return RITUS[1]; // Vasanta
  if ((month === 4 && day >= 15) || month === 5 || (month === 6 && day < 15)) return RITUS[2]; // Grishma
  if ((month === 6 && day >= 15) || month === 7 || (month === 8 && day < 15)) return RITUS[3]; // Varsha
  if ((month === 8 && day >= 15) || month === 9 || (month === 10 && day < 15)) return RITUS[4]; // Sharad
  return RITUS[5]; // Hemanta
}

// ============================================================================
// MODULE 2: DRAVYA GUNA (द्रव्यगुण विज्ञान) — Classical Pharmacopeia
// ============================================================================
const CANONICAL_HERBS = [
  {
    id: "ashwagandha",
    name_sanskrit: "अश्वगन्धा (Ashwagandha)",
    botanical_name: "Withania somnifera (L.) Dunal",
    family: "Solanaceae",
    common_names: "Indian Ginseng, Winter Cherry",
    rasa: ["Tikta (Bitter)", "Kashaya (Astringent)", "Madhura (Sweet)"],
    guna: ["Laghu (Light)", "Snigdha (Unctuous)"],
    virya: "Ushna (Hot potency)",
    vipaka: "Madhura (Sweet post-digestive effect)",
    prabhava: "Balya & Rasayana (Deep tissue rejuvenation and adaptogenic vitality)",
    doshakarma: "Vata-Kapha Shamaka (Pacifies Vata & Kapha; slightly increases Pitta in excess)",
    classical_citation: "Bhavaprakasha Nighantu, Guduchyadi Varga:189-190",
    sanskrit_shloka: "अश्वगन्धाऽनिलश्लेष्मश्वित्रशोथक्षयापहा। बल्या रसायनी तिक्ता कषायोष्णोऽतिशुक्रला॥",
    indications: ["Nervous debility (Vatavyadhi)", "Insomnia (Anidra)", "Physical emaciation (Karshya)", "Stress & anxiety (Chittodvega)", "Libido depletion (Klaibya)"],
    therapeutics: "Nourishes the deepest Ojas and Majja Dhatu (nervous system). Increases stress resilience and muscle tone.",
    recommended_dose: "3 - 6 grams of root churna (powder) per day.",
    anupana: "Warm Cow's Milk, Ghee, or warm water sweetened with honey or rock sugar.",
    contraindications: "Acute fever (Taruna Jwara), severe Pitta inflammation, high Ama toxicity.",
  },
  {
    id: "triphala",
    name_sanskrit: "त्रिफला (Triphala)",
    botanical_name: "Polyherbal synergy: Amalaki + Haritaki + Bibhitaki",
    family: "Combretaceae / Phyllanthaceae",
    common_names: "The Three Sacred Fruits",
    rasa: ["Pancha-Rasa (Contains 5 of 6 tastes — Sweet, Sour, Pungent, Bitter, Astringent; lacks only Salty)"],
    guna: ["Laghu (Light)", "Ruksha (Dry)"],
    virya: "Anushna-sheeta (Mildly neutral to slightly cooling)",
    vipaka: "Madhura (Sweet post-digestive effect)",
    prabhava: "Chakshushya & Rasayana (Improves eyesight and longevity; cleanses without depleting)",
    doshakarma: "Tridoshahara (Balances Vata, Pitta, and Kapha equally)",
    classical_citation: "Charaka Samhita Chikitsasthana 1:2 & Sushruta Sutrasthana 38:56-57",
    sanskrit_shloka: "त्रिफला कफपित्तघ्नी मेहकुष्ठविनाशिनी। चक्षुष्या दीपनी रुच्या विषमज्वरनाशिनी॥",
    indications: ["Sluggish bowel / Constipation (Vibandha)", "Toxin buildup (Ama)", "Eye strain / Poor vision (Drishti Mandya)", "High blood sugar (Prameha)", "Sluggish metabolism (Medoroga)"],
    therapeutics: "Gently tones and cleanses the entire gastrointestinal tract, supports healthy microbiome without habit-forming laxative stress.",
    recommended_dose: "3 - 5 grams with warm water before sleep.",
    anupana: "Warm water (for daily colon tonic), Honey (for Kapha reduction), Ghee (for eye health & Vata).",
    contraindications: "Severe diarrhea, acute dysentery, advanced pregnancy without doctor supervision.",
  },
  {
    id: "brahmi",
    name_sanskrit: "ब्राह्मी (Brahmi / Bacopa)",
    botanical_name: "Bacopa monnieri (L.) Wettst.",
    family: "Plantaginaceae",
    common_names: "Water Hyssop, Herb of Grace",
    rasa: ["Tikta (Bitter)", "Kashaya (Astringent)", "Madhura (Sweet)"],
    guna: ["Laghu (Light)", "Sara (Flowing)"],
    virya: "Sheeta (Cooling potency)",
    vipaka: "Madhura (Sweet post-digestive effect)",
    prabhava: "Medhya (Profound enhancer of cognitive intellect, memory, and spiritual clarity)",
    doshakarma: "Tridosha Shamaka, particularly soothes fiery Pitta and turbulent Vata in the head",
    classical_citation: "Charaka Samhita Sutrasthana 4:18 & Bhavaprakasha Nighantu",
    sanskrit_shloka: "ब्राह्मी हिमा सरा तिक्ता मेध्या स्वर्या स्मृतिप्रदा। कुष्ठपाण्डुप्रमेहस्रकासश्वासविषप्रणुत्॥",
    indications: ["Memory loss & brain fog (Smriti Mandya)", "ADHD / Restlessness (Unmada)", "Mental fatigue (Shrama)", "Anxiety & hypertension (Raktachapa)", "Speech disorders (Vak Swarupa)"],
    therapeutics: "Improves synaptic transmission, protects cerebral cortex against oxidative burnout, deepens meditation and restful sleep.",
    recommended_dose: "2 - 5 grams of powder, or 10 - 20 ml of fresh swarasa (juice).",
    anupana: "Cow's Ghee (Brahmi Ghrita), honey, or warm milk.",
    contraindications: "Extreme bradycardia (very low heart rate), cold congestion.",
  },
  {
    id: "shatavari",
    name_sanskrit: "शतावरी (Shatavari)",
    botanical_name: "Asparagus racemosus Willd.",
    family: "Asparagaceae",
    common_names: "Wild Asparagus, She Who Possesses 100 Husbands",
    rasa: ["Madhura (Sweet)", "Tikta (Bitter)"],
    guna: ["Guru (Heavy)", "Snigdha (Unctuous)"],
    virya: "Sheeta (Cooling potency)",
    vipaka: "Madhura (Sweet post-digestive effect)",
    prabhava: "Stanyajanana & Rasayana (Supreme female reproductive restorative and milk promoter)",
    doshakarma: "Vata-Pitta Shamaka (Highly soothing to Vata and Pitta; increases Kapha in excess)",
    classical_citation: "Bhavaprakasha Nighantu, Guduchyadi Varga:186-187",
    sanskrit_shloka: "शतावरी गुरुः शीता तिक्ता स्वादु रसायनी। मेध्याऽग्निपुष्टिदा स्निग्धा नेत्र्या स्तन्यशुक्रापहा॥",
    indications: ["Hormonal imbalance / Menopause (Raja Nivriti)", "Gastric ulcers & hyperacidity (Amlapitta)", "Dry cough & throat irritation (Kasa)", "Lactation insufficiency (Stanya Kshaya)", "Infertility (Vandhyatva)"],
    therapeutics: "Nourishes the mucous membranes of the lungs, stomach, kidneys, and reproductive system (Shukra & Artava Dhatu).",
    recommended_dose: "3 - 6 grams of churna.",
    anupana: "Warm milk sweetened with rock sugar (Mishri), or ghee.",
    contraindications: "Severe pulmonary congestion, thick Kapha edema, estrogen-sensitive dampness.",
  },
  {
    id: "tulsi",
    name_sanskrit: "तुलसी (Surasa / Tulsi)",
    botanical_name: "Ocimum sanctum L. / Ocimum tenuiflorum",
    family: "Lamiaceae",
    common_names: "Holy Basil, Sacred Basil",
    rasa: ["Katu (Pungent)", "Tikta (Bitter)"],
    guna: ["Laghu (Light)", "Ruksha (Dry)", "Tikshna (Sharp/Penetrating)"],
    virya: "Ushna (Heating potency)",
    vipaka: "Katu (Pungent post-digestive effect)",
    prabhava: "Bhuta-ghni & Hridya (Clears microbial pathogens and protects the cardiac center)",
    doshakarma: "Kapha-Vata Shamaka (Dries up Kapha mucus and calms cold Vata; aggravates Pitta)",
    classical_citation: "Charaka Samhita Sutrasthana 27 & Bhavaprakasha Nighantu",
    sanskrit_shloka: "तुलसी कटुका तिक्ता हृद्योष्णा दाहपित्तकृत्। दीपनी कुष्ठकृच्छ्रास्रपार्श्वरुक् कफवातजित्॥",
    indications: ["Cough & bronchitis (Kasa / Shwasa)", "Viral fevers (Jwara)", "Sinus congestion (Pratishyaya)", "Cardiac debility (Hridroga)", "Headaches due to cold"],
    therapeutics: "Potent bio-enhancer and immune adaptogen; clears respiratory channels (Pranavaha Srotas) and promotes mental Sattva.",
    recommended_dose: "1 - 3 grams dry leaf powder or 5 - 10 ml fresh leaf juice.",
    anupana: "Warm water, raw honey, or boiled into a herbal decoction (Kashaya).",
    contraindications: "Hyperacidity, bleeding disorders (Raktapitta), burning urination.",
  },
  {
    id: "guduchi",
    name_sanskrit: "गुडूची (Amrita / Guduchi)",
    botanical_name: "Tinospora cordifolia (Willd.) Miers",
    family: "Menispermaceae",
    common_names: "Heart-leaved Moonseed, Giloy",
    rasa: ["Tikta (Bitter)", "Kashaya (Astringent)"],
    guna: ["Laghu (Light)", "Snigdha (Unctuous)"],
    virya: "Ushna (Mildly heating yet Pitta-pacifying due to its unique Prabhava)",
    vipaka: "Madhura (Sweet post-digestive effect)",
    prabhava: "Vayasthapana & Jwaraghna (Prevents cellular aging and dispels chronic intermittent fevers)",
    doshakarma: "Tridoshahara (Balances all three Doshas with supreme clinical versatility)",
    classical_citation: "Charaka Samhita Sutrasthana 4:18 & Bhavaprakasha Nighantu",
    sanskrit_shloka: "गुडूची कटुका तिक्ता स्वादुपाका रसायनी। संग्राहिणी कषायोष्णा लघ्वी बल्याऽग्निदीपनी॥",
    indications: ["Chronic low-grade fevers (Jirna Jwara)", "Gout & high uric acid (Vatarakta)", "Allergic dermatitis (Kushtha)", "Immune suppression (Ojas Kshaya)", "Jaundice & liver sluggishness (Kamala)"],
    therapeutics: "Burns toxic Ama without overheating body tissues; strengthens hepatic detoxification pathways.",
    recommended_dose: "1 - 3 grams of extract (Guduchi Satva) or 3 - 6 grams of stem powder.",
    anupana: "Warm water, honey (for Kapha), ghee (for Vata/Pitta), or rock sugar.",
    contraindications: "None significant in therapeutic doses; monitor during pregnancy.",
  },
  {
    id: "haridra",
    name_sanskrit: "हरिद्रा (Nisha / Haridra)",
    botanical_name: "Curcuma longa L.",
    family: "Zingiberaceae",
    common_names: "Turmeric, Golden Spice",
    rasa: ["Tikta (Bitter)", "Katu (Pungent)"],
    guna: ["Laghu (Light)", "Ruksha (Dry)"],
    virya: "Ushna (Hot potency)",
    vipaka: "Katu (Pungent post-digestive effect)",
    prabhava: "Varnya & Lekhana (Improves skin radiance and scrapes atherosclerotic toxins)",
    doshakarma: "Kapha-Vata Shamaka, Rakta Shodhaka (Cleanses the blood and lymphatic tissues)",
    classical_citation: "Charaka Samhita Sutrasthana 4:11 & Bhavaprakasha Nighantu",
    sanskrit_shloka: "हरिद्रा कटुका तिक्ता रूक्षोष्णा कफपित्तनुत्। वर्ण्या त्वग्दोषमेहास्त्रशोथपाण्डुव्रणापहा॥",
    indications: ["Systemic inflammation (Shotha)", "Diabetes mellitus (Prameha)", "Acne & eczema (Twak Roga)", "Wound healing (Vrana)", "Allergic rhinitis"],
    therapeutics: "Profound anti-inflammatory; purifies blood tissue (Rakta Dhatu) and enhances insulin receptor sensitivity.",
    recommended_dose: "1 - 3 grams of rhizome powder daily.",
    anupana: "Warm milk with a pinch of black pepper (Golden Milk) or warm water with honey.",
    contraindications: "Active gallstones obstructing bile duct, acute hyper-bleeding.",
  },
  {
    id: "amalaki",
    name_sanskrit: "आमलकी (Dhatri / Amalaki)",
    botanical_name: "Phyllanthus emblica L. (Emblica officinalis)",
    family: "Phyllanthaceae",
    common_names: "Indian Gooseberry, Amla",
    rasa: ["Amla (Predominantly Sour), Kashaya (Astringent), Madhura (Sweet), Tikta (Bitter), Katu (Pungent)"],
    guna: ["Laghu (Light)", "Ruksha (Dry)"],
    virya: "Sheeta (Cooling potency — rare among sour substances!)",
    vipaka: "Madhura (Sweet post-digestive effect)",
    prabhava: "Vayasthapana & Rasayana (The supreme anti-aging nectar fruit of Charaka)",
    doshakarma: "Tridoshahara, specifically supreme for pacifying aggravated Pitta",
    classical_citation: "Charaka Samhita Chikitsasthana 1:1 & Astanga Hridaya Sutrasthana 6:38",
    sanskrit_shloka: "आमलकं वयं स्थापयति दीपयति च पावकम्। चक्षुष्यं सर्वदोषघ्नं रसायणमुत्तमम्॥",
    indications: ["Premature greying & hair loss (Khalitya/Palitya)", "Hyperacidity & gastritis (Amlapitta)", "Low hemoglobin / Anemia (Pandu)", "Ocular debility (Timira)", "General exhaustion"],
    therapeutics: "Exceptionally rich in stable heat-resistant bio-vitamin C; protects cellular DNA against free radical damage.",
    recommended_dose: "3 - 6 grams of fruit powder, or 10 - 20 ml fresh juice.",
    anupana: "Honey, Ghee, or warm water.",
    contraindications: "Severe acute diarrhea, cold dry cough without honey.",
  },
];

// ============================================================================
// MODULE 3: AGNI & AMA PARIKSHA (अग्नि एवं आम परीक्षा) — Diagnostic
// ============================================================================
const AGNI_AMA_QUIZ_QUESTIONS = [
  {
    id: "appetite_pattern",
    question: "How would you describe your appetite and hunger pattern?",
    options: [
      { text: "Sharp, intense, intolerable hunger; I become irritable or get headaches if I miss a meal.", agni: "tikshna", ama: 10 },
      { text: "Fluctuating & erratic; one day I am ravenous, the next I forget to eat completely.", agni: "visham", ama: 15 },
      { text: "Sluggish and low; I can easily skip meals without feeling hungry, and feel heavy after eating.", agni: "manda", ama: 25 },
      { text: "Predictable, steady, and comfortable; I digest standard meals in 4 hours cleanly.", agni: "sama", ama: 0 },
    ],
  },
  {
    id: "tongue_coating",
    question: "When you look at your tongue in the mirror upon waking, what do you observe?",
    options: [
      { text: "Clean, pink, moist with little to no visible coating.", agni: "sama", ama: 0 },
      { text: "Dry, slightly rough, brownish or crackled coating, especially at the back.", agni: "visham", ama: 15 },
      { text: "Yellowish or reddish coating with red spots or feeling of heat/bitterness.", agni: "tikshna", ama: 20 },
      { text: "Thick, white, greasy, pasty coating that is hard to scrape off.", agni: "manda", ama: 30 },
    ],
  },
  {
    id: "bowel_regularity",
    question: "What best describes your morning bowel elimination?",
    options: [
      { text: "Effortless, once daily upon waking, floating, well-formed with no offensive odor.", agni: "sama", ama: 0 },
      { text: "Constipated, dry, pebbly, irregular; often missing days or straining.", agni: "visham", ama: 20 },
      { text: "Loose, urgent, burning, multiple times a day with yellow tint.", agni: "tikshna", ama: 15 },
      { text: "Sticky, heavy, leaves stains in the toilet, sinks in water, feeling of incomplete evacuation.", agni: "manda", ama: 30 },
    ],
  },
  {
    id: "post_meal_feeling",
    question: "How do you consistently feel 30 to 60 minutes after consuming a normal lunch?",
    options: [
      { text: "Energized, light, clear-headed and ready to work.", agni: "sama", ama: 0 },
      { text: "Bloated, gassy, burping, occasional abdominal gurgling or cramps.", agni: "visham", ama: 20 },
      { text: "Burning in chest or throat (acid reflux), hot flushes, or excessive thirst.", agni: "tikshna", ama: 15 },
      { text: "Drowsy, extremely heavy, brain fog, craving an immediate nap.", agni: "manda", ama: 25 },
    ],
  },
  {
    id: "morning_energy",
    question: "How do you feel physically when you wake up in the morning?",
    options: [
      { text: "Fresh, light, enthusiastic, clear throat and head.", agni: "sama", ama: 0 },
      { text: "Restless or anxious, stiff joints that click or ache until moving.", agni: "visham", ama: 15 },
      { text: "Alert but feeling warm or irritable; mouth tastes sour or metallic.", agni: "tikshna", ama: 10 },
      { text: "Extremely groggy, heavy limbs, mucus in throat or crusty eyes, hard to get out of bed.", agni: "manda", ama: 30 },
    ],
  },
];

/**
 * Diagnostic logic evaluating Agni type and Ama percentage
 */
function evaluateAgniAma(answers = {}) {
  let vishamScore = 0;
  let tikshnaScore = 0;
  let mandaScore = 0;
  let samaScore = 0;
  let totalAma = 0;

  for (const q of AGNI_AMA_QUIZ_QUESTIONS) {
    const chosenIndex = answers[q.id];
    if (chosenIndex !== undefined && q.options[chosenIndex]) {
      const opt = q.options[chosenIndex];
      if (opt.agni === "visham") vishamScore++;
      else if (opt.agni === "tikshna") tikshnaScore++;
      else if (opt.agni === "manda") mandaScore++;
      else if (opt.agni === "sama") samaScore++;

      totalAma += opt.ama;
    }
  }

  // Calculate Ama percentage (normalized 0 - 100%)
  const amaPercentage = Math.min(100, Math.round((totalAma / 135) * 100));

  // Determine dominant Agni state
  let primaryAgni = "Sama Agni (Balanced Digestive Fire)";
  let agniType = "sama";
  let doshaAssociation = "Tridosha in equilibrium";
  let pathophysiology = "Nutrients (Ahara Rasa) are transformed completely into healthy tissues (Dhatus) with zero toxic byproduct.";
  let classicalCitation = "Charaka Samhita Vimanasthana 6:12 & Astanga Hridaya Sharirasthana 3:52";
  let dipanaPachanaTherapy = "Maintain clean eating, do not overeat, and take ginger-cumin tea after heavy meals.";

  const maxScore = Math.max(vishamScore, tikshnaScore, mandaScore, samaScore);

  if (vishamScore === maxScore && vishamScore > samaScore) {
    primaryAgni = "Visham Agni (Irregular / Erratic Agni)";
    agniType = "visham";
    doshaAssociation = "Vata Dosha Aggravation";
    pathophysiology = "Turbulent Vata causes irregular combustion in the stomach; digestion swings wildly from fast to stagnant, creating gas, dry stools, and fluctuating energy.";
    classicalCitation = "Charaka Samhita Vimanasthana 6:12: 'विषमो वातेन'";
    dipanaPachanaTherapy = "Drink warm water infused with dry ginger, cumin, and rock salt (Hingwashtak Churna). Eat warm, unctuous, freshly cooked meals at fixed clock hours.";
  } else if (tikshnaScore === maxScore && tikshnaScore > samaScore) {
    primaryAgni = "Tikshna Agni (Hyper-Active / Fiery Agni)";
    agniType = "tikshna";
    doshaAssociation = "Pitta Dosha Aggravation";
    pathophysiology = "Excessive gastric digestive liquid (Pachaka Pitta) burns food before it can nourish tissues, resulting in acidity, inflammation, skin heat, and burning sensations.";
    classicalCitation = "Charaka Samhita Vimanasthana 6:12: 'तीक्ष्णः पित्तेन'";
    dipanaPachanaTherapy = "Cooling digestive spices: Fennel (Saunf), coriander (Dhanya), mint, and amla juice. Avoid vinegar, chilies, and fried foods; take Cow's Ghee before meals.";
  } else if (mandaScore === maxScore && mandaScore > samaScore) {
    primaryAgni = "Manda Agni (Sluggish / Low Digestive Fire)";
    agniType = "manda";
    doshaAssociation = "Kapha Dosha Aggravation";
    pathophysiology = "Cold, heavy, viscous Kapha extinguishes the metabolic digestive flame; food sits fermenting in the stomach, producing thick, sticky, channel-blocking endotoxins (Ama).";
    classicalCitation = "Charaka Samhita Vimanasthana 6:12: 'मन्दः कफेन' & Astanga Hridaya Nidanasthana 12:1: 'रोगाः सर्वेऽपि मन्दाग्नौ'";
    dipanaPachanaTherapy = "Take Trikatu (dry ginger, black pepper, long pepper) with honey 15 minutes before meals. Sip hot ginger water throughout the day. Fast on light vegetable broths.";
  }

  // Ama Status categorization
  let amaStatus = "Nirama (Free of Endotoxins / Clean Channels)";
  let amaRemediation = "Continue routine Rasayana and moderate seasonal diet.";
  if (amaPercentage > 60) {
    amaStatus = "Saama (Severe Systemic Ama / Obstructed Channels - Srotorodha)";
    amaRemediation = "Initiate Langhana (light fasting or mono-diet of moong dal soup), hot water sips every 30 mins, and avoid all dairy, gluten, cold drinks, and heavy fats for 3-5 days.";
  } else if (amaPercentage > 25) {
    amaStatus = "Alpa-Ama (Mild to Moderate Endotoxin Accumulation)";
    amaRemediation = "Incorporate digestive spices (cumin, coriander, fennel, ginger), avoid eating after 7:30 PM, and exercise enough to break a mild sweat daily.";
  }

  return {
    primary_agni: primaryAgni,
    agni_type: agniType,
    dosha_association: doshaAssociation,
    pathophysiology,
    classical_citation: classicalCitation,
    ama_percentage: amaPercentage,
    ama_status: amaStatus,
    dipana_pachana_therapy: dipanaPachanaTherapy,
    ama_remediation: amaRemediation,
  };
}

// ============================================================================
// MODULE 4: NIDRA VIDHI (निद्रा विधि) — Circadian Sleep & Ojas Planner
// ============================================================================
const NIDRA_CHRONO_CYCLES = [
  {
    window: "06:00 PM – 10:00 PM",
    dosha: "Kapha Kaala",
    quality: "Heavy, grounding, stabilizing, cooling",
    ayurvedic_action: "Natural biological drowsiness peaks between 9:00 PM and 10:00 PM. Falling asleep in this window produces deepest cellular repair and Ojas restoration.",
  },
  {
    window: "10:00 PM – 02:00 AM",
    dosha: "Pitta Kaala",
    quality: "Metabolic transformation, internal liver detoxification, subtle fire",
    ayurvedic_action: "If awake past 10:30 PM, internal heat awakens the brain ('second wind'), causing racing thoughts, late-night snacking, and disturbed liver cleansing.",
  },
  {
    window: "02:00 AM – 06:00 AM",
    dosha: "Vata Kaala",
    quality: "Light, mobile, expansive, ethereal",
    ayurvedic_action: "The optimal spiritual awakening window (Brahma Muhurta ~4:30 AM to 5:30 AM) occurs when sattvic Vata enhances intellect, memory, and calm breath.",
  },
];

const DOSHA_NIDRA_PROTOCOLS = {
  vata: {
    dosha: "Vata Predominant Sleep Protocol",
    sleep_archetype: "Light, erratic, easily disturbed by sounds, vivid dreams, prone to early morning waking (around 3 AM).",
    optimal_sleep_duration: "8 – 8.5 hours",
    ideal_bedtime: "09:45 PM",
    ideal_waketime: "06:00 AM",
    classical_therapy: "Padabhyanga (massaging soles of feet with warm sesame or Mahanarayana oil before bed).",
    herbal_tonic: "Warm cow's milk or almond milk simmered with Ashwagandha (3g), a pinch of nutmeg (Jatiphala), and ghee.",
    bedroom_tuning: "Warm, quiet, heavy blanket, diffuse calming lavender or jatamansi oil.",
    classical_citation: "Charaka Samhita Sutrasthana 21:35-40 (Nidrayattam Sukham Dukham)",
  },
  pitta: {
    dosha: "Pitta Predominant Sleep Protocol",
    sleep_archetype: "Moderate, warm, passionate dreams; wakes up hot or alert if stressed; prone to insomnia if working past 10 PM.",
    optimal_sleep_duration: "7 – 7.5 hours",
    ideal_bedtime: "10:15 PM (strictly before 10:30 PM)",
    ideal_waketime: "05:30 AM",
    classical_therapy: "Shiroabhyanga with Brahmi Taila or Coconut oil; washing eyes with rose water.",
    herbal_tonic: "Cooling milk decoction with crushed cardamom pods (Ela), saffron, and a dash of Shatavari.",
    bedroom_tuning: "Cool, well-ventilated, dim lighting, no screens after 9:30 PM to prevent optic Pitta stimulation.",
    classical_citation: "Astanga Hridaya Sutrasthana 7:53-62",
  },
  kapha: {
    dosha: "Kapha Predominant Sleep Protocol",
    sleep_archetype: "Deep, heavy, prolonged sleep; difficult morning waking; grogginess if sleeping over 7 hours.",
    optimal_sleep_duration: "6 – 6.5 hours (excess sleep produces deadly Ama & heaviness)",
    ideal_bedtime: "10:30 PM",
    ideal_waketime: "05:00 AM (Brahma Muhurta wake up is essential)",
    classical_therapy: "Dry brushing (Garshana) before sleep; avoiding daytime naps completely.",
    herbal_tonic: "Warm chamomile or ginger tea with a drop of raw honey; no dairy at night.",
    bedroom_tuning: "Fresh, airy, minimal blankets, uplifting eucalyptus or tulsi fragrance.",
    classical_citation: "Charaka Samhita Sutrasthana 21:45-49",
  },
};

// ============================================================================
// MODULE 5: PATHYA & GHARELU UPACHAR (घरेलू उपचार) — Classical Home Remedies
// ============================================================================
const HOME_REMEDIES = [
  {
    id: "amlapitta",
    ailment_sanskrit: "अम्लपित्त (Amlapitta)",
    ailment_english: "Hyperacidity, Acid Reflux & Heartburn",
    dosha_involved: "Aggravated Pachaka Pitta with sour liquid increase (Amla-Dravata)",
    classical_script: "Bhaishajya Ratnavali, Amlapitta Rogadhikara & Charaka Samhita",
    sanskrit_principle: "शीतं स्वादु तिक्तं च पित्तशमनम्",
    symptoms: ["Burning chest / retrosternal burn", "Sour water brash", "Nausea after spicy food", "Throat irritation"],
    remedy_title: "Coriander & Fennel Cold Infusion (Dhanya-Mishreya Hima)",
    ingredients: [
      "1 tbsp Whole Coriander Seeds (Dhanyaka)",
      "1 tbsp Sweet Fennel Seeds (Mishreya)",
      "2 cups Pure room-temperature Water",
      "1 tsp Unrefined Rock Sugar (Mishri)"
    ],
    preparation: "Lightly crush coriander and fennel seeds. Steep in 2 cups of water overnight or for at least 4 hours. Strain liquid, stir in rock sugar, and sip on an empty stomach in the morning.",
    clinical_mechanism: "Coriander's Kashaya-Tikta rasa neutralizes excess stomach acid, while fennel relaxes the esophageal sphincter and dispels burning sensations.",
    lifestyle_guideline: "Avoid eating within 3 hours of sleeping; strictly avoid tomatoes, vinegar, green chilies, and sour yogurt.",
    when_to_see_vaidya: "If vomiting blood, chronic black stools, or severe dysphagia (difficulty swallowing) occurs.",
  },
  {
    id: "pratishyaya",
    ailment_sanskrit: "प्रतिश्याय (Pratishyaya)",
    ailment_english: "Common Cold, Sinus Congestion & Running Nose",
    dosha_involved: "Vata-Kapha vitiation obstructing Pranavaha Srotas",
    classical_script: "Sushruta Samhita Uttaratantra 24 & Sharangadhara Samhita",
    sanskrit_principle: "उष्णं कटु तीक्ष्णं कफवातहरम्",
    symptoms: ["Nasal blockage", "Watery / thick discharge", "Heaviness in forehead", "Mild body ache"],
    remedy_title: "Golden Turmeric Ginger Honey Kashaya",
    ingredients: [
      "1/2 tsp Pure Turmeric Powder (Haridra)",
      "1/2 inch Fresh grated Ginger root (Ardraka)",
      "3-4 crushed Whole Black Peppercorns (Maricha)",
      "1.5 cups Water",
      "1 tsp Raw Organic Honey (added only when lukewarm!)"
    ],
    preparation: "Boil water with ginger, black pepper, and turmeric until reduced by half. Strain into a cup. Let it cool until lukewarm (under 40°C), then stir in raw honey.",
    clinical_mechanism: "Black pepper enhances curcumin absorption by 2000%; the hot pungent action (Ushna Virya) liquefies and expels sinus phlegm.",
    lifestyle_guideline: "Keep neck and ears covered; inhale steam infused with 2 drops of eucalyptus or carom seeds (Ajwain); no cold drinks.",
    when_to_see_vaidya: "High spiking fever above 102°F or breathlessness persisting beyond 4 days.",
  },
  {
    id: "adhmana",
    ailment_sanskrit: "आध्मान एवं आनाह (Adhmana & Anaha)",
    ailment_english: "Abdominal Bloating, Flatulence & Gas",
    dosha_involved: "Apana Vata obstructed in the colon (Pakvashaya)",
    classical_script: "Chakradatta, Vataroga Chikitsa & Charaka Samhita",
    sanskrit_principle: "दीपनं पाचनं वातविबन्धनुत्",
    symptoms: ["Distended abdomen like a drum", "Trapped gas cramps", "Belching", "Difficulty with downward gas passage"],
    remedy_title: "Hing & Roasted Ajwain Digestive Churna",
    ingredients: [
      "1 tsp Carom Seeds (Ajwain)",
      "1 pinch Pure Asafoetida (Hing / roasted in a drop of ghee)",
      "1/4 tsp Himalayan Black Salt (Kala Namak)",
      "1 cup Warm Water"
    ],
    preparation: "Dry roast ajwain seeds in a pan until fragrant. Add a pinch of ghee-roasted hing and black salt. Chew thoroughly followed by sipping warm water.",
    clinical_mechanism: "Ajwain contains thymol which stimulates pancreatic enzymes, while hing is the supreme Ayurvedic antispasmodic for restoring natural downward Apana Vata flow.",
    lifestyle_guideline: "Walk 100 paces (Shatapadi) after meals; avoid raw salads and carbonated sodas.",
    when_to_see_vaidya: "Severe unremitting colic pain, persistent vomiting, or inability to pass flatus or stool for 48 hours.",
  },
  {
    id: "anidra",
    ailment_sanskrit: "अनिद्रा (Anidra / Asvapna)",
    ailment_english: "Insomnia, Restless Sleep & Racing Mind",
    dosha_involved: "Tarpaka Kapha depletion and Prana Vata agitation in the head (Mano-vaha Srotas)",
    classical_script: "Charaka Samhita Sutrasthana 21 & Bhavaprakasha",
    sanskrit_principle: "स्निग्धोष्णं गुरु वातशामकं च निद्राकरम्",
    symptoms: ["Tossing and turning", "Mental chatter", "Light sleep easily broken", "Morning lethargy"],
    remedy_title: "Jatiphala (Nutmeg) Spiced Golden Night Milk",
    ingredients: [
      "1 cup Whole A2 Cow's Milk (or Almond Milk)",
      "1/8 tsp Freshly grated Nutmeg (Jatiphala - do not exceed dose!)",
      "1/4 tsp Ashwagandha powder",
      "1/2 tsp Pure Cow's Ghee"
    ],
    preparation: "Simmer milk with Ashwagandha and ghee for 3 minutes. Pour into a mug, sprinkle freshly grated nutmeg on top, and consume warm 30 minutes before bed.",
    clinical_mechanism: "Nutmeg contains myristicin with natural mild sedative phytochemical properties that ground erratic Prana Vata and stabilize brain neurotransmitters.",
    lifestyle_guideline: "Perform a 5-minute foot massage with warm sesame oil before getting into bed. Dim all white LED lights.",
    when_to_see_vaidya: "Chronic insomnia lasting months accompanied by clinical depression or severe memory decline.",
  },
  {
    id: "sandhi_shula",
    ailment_sanskrit: "सन्धिगत वात (Sandhigata Vata)",
    ailment_english: "Joint Pain, Morning Stiffness & Cracking Joints",
    dosha_involved: "Vata accumulation drying up Shleshaka Kapha (synovial fluid)",
    classical_script: "Charaka Samhita Chikitsasthana 28 (Vatavyadhi Chikitsa)",
    sanskrit_principle: "स्नेहनं स्वेदनं चैव वातव्याधौ प्रशस्यते",
    symptoms: ["Joint crepitus (cracking sounds)", "Pain exacerbated by cold or cloudy weather", "Reduced mobility", "Morning stiffness"],
    remedy_title: "Methi & Shunthi Warm Decoction (Fenugreek-Ginger Water)",
    ingredients: [
      "1 tsp Fenugreek Seeds (Methi Dana)",
      "1/2 tsp Dry Ginger Powder (Shunthi)",
      "1.5 cups Water"
    ],
    preparation: "Soak methi seeds overnight in water. In the morning, boil the water with ginger powder for 5 minutes. Strain and drink warm; optionally chew the softened methi seeds.",
    clinical_mechanism: "Methi provides natural anti-inflammatory saponins that nourish synovial fluid, while dry ginger dispels deep cold Vata from joint capsules.",
    lifestyle_guideline: "Apply warm Mahanarayana or Sesame oil locally over joints followed by hot water fomentation; avoid cold drafts.",
    when_to_see_vaidya: "Hot, swollen, red joints with fever (suggests inflammatory Amavata/Rheumatoid Arthritis which requires distinct treatment).",
  },
  {
    id: "vibandha",
    ailment_sanskrit: "विबन्ध (Vibandha)",
    ailment_english: "Sluggish Colon & Chronic Constipation",
    dosha_involved: "Dry, rough Vata desiccating fecal matter in Pakvashaya",
    classical_script: "Astanga Hridaya Chikitsasthana 15 & Bhaishajya Ratnavali",
    sanskrit_principle: "अनुलोमनं स्निग्धं च विबन्धनाशकम्",
    symptoms: ["Hard dry stools", "Missing days", "Abdominal heaviness", "Headaches from autointoxication"],
    remedy_title: "Munakka (Black Raisin) & Warm Ghee Elixir",
    ingredients: [
      "10-12 Large Black Raisins (Munakka / seeds removed)",
      "1 cup Warm Cow's Milk or Hot Water",
      "1 tsp Pure Cow's Ghee"
    ],
    preparation: "Boil the seeded munakka in milk or water for 5 minutes. Stir in the ghee. Eat the soft plump raisins and drink the warm liquid right before bedtime.",
    clinical_mechanism: "Munakka provides gentle osmotic laxative fiber without gripping, while ghee lubricates the dry intestinal lining (Snigdha Guna) to enable natural peristalsis.",
    lifestyle_guideline: "Drink 2 glasses of warm water immediately upon waking (Ushapan); consume adequate stewed fruits.",
    when_to_see_vaidya: "Rectal bleeding, unexplained rapid weight loss, or severe obstipation.",
  },
];

module.exports = {
  RITUS,
  getCurrentRitu,
  CANONICAL_HERBS,
  AGNI_AMA_QUIZ_QUESTIONS,
  evaluateAgniAma,
  NIDRA_CHRONO_CYCLES,
  DOSHA_NIDRA_PROTOCOLS,
  HOME_REMEDIES,
};
