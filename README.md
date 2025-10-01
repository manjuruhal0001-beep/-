# संस्कृतम् (देवनागरीलिपिः) — Sanskrit (Devanagari)

संस्कृत-केवल-भाषा-आधारित सङ्गणक-भाषा व तन्त्र — स्रोत, संदेशा:, तथा उपयोगकर्ता-अनुभवः सर्वम् देवनागरी-लिप्याः एव।

## लक्ष्याः
- आत्मनिर्भर-संस्कृत-भाषा (SaLang) — कर्नेल/ड्राइवर/अनुप्रयोगार्थम्।
- सूक्ष्म-केन्द्रक (microkernel) तथा संस्कृत-प्रथम-अन्तर्मुखम्।
- औजार-समूहः: संकलकः, रूपाकारकः, व्याख्याता, पैकेज-प्रबन्धकः।

## वर्तमानावस्था (Phase 0 — सिद्धान्त-नीतिः)
- लिपिः: देवनागरी अनिवार्या; अन्य-लिपिः निषिद्धा।
- अङ्काः: केवलं देवनागरी-अङ्काः (०–९) दशमाधारः।
- वाक्य-समाप्तिः: दण्ड `।`।
- निवेशनम्: `स्थापय नाम, मान`।
- समास-क्रियाः (ऑपरेटराः): `योग/घट/गुण/भाग/सम/असम/लघु/महान्/लघु-सम/महान्-सम/च/वा/न`।
- खण्ड-सीमा: `आरम्भ … समाप्ति` (कुंचक `{}` अपि स्वीकृतम्)।
- संग्रह-मानकीकरणम्: UTF‑8 + NFC; दण्ड-आधारित-वाक्य; मूल/मानकीत-द्वय-संग्रहः।

## संक्षिप्त-उदाहरणम्
```
कार्य मुख्य() आरम्भ
  स्थापय गणना, १२३।
  यदि गणना लघु २०० तदा लिख("लघु") अन्यथा लिख("बृहत्")।
  लिख("नमस्ते")।
समाप्ति।
```

### पुनरावर्तन-उदाहरणः (फैक्टोरियल)
`src/उदाहरण/फैक्टोरियल.सं`
```
कार्य फल(न: पूर्ण): पूर्ण आरम्भ
  यदि न सम ० तदा
    निवर्तय १।
  अन्यथा
    निवर्तय गुण(न, फल(घट न, १))।
समाप्ति
```

## संचिका-विन्यासः
```
src/कण्ठि/शब्दविभाजक.सं   ← टोकनाइज़र (देवनागरी-अङ्क, दण्ड, शब्द-ऑपरेटराः)
src/कण्ठि/वाक्यविच्छेदक.सं ← पार्सर-कंकाल
src/निर्गम/लेख_उत्पादक.सं  ← बाइटकोड-उत्पादकः (लिख/स्थापय/सूचि/मानचित्र/लूप्)
src/यन्त्रमुख/व्याख्याता.सं ← व्याख्याता-कंकाल
src/उदाहरण/प्रथम.सं        ← नमस्ते
src/उदाहरण/फैक्टोरियल.सं   ← पुनरावर्तन-उदाहरणः
```

## उपयोग-निर्देशाः
- शीघ्रं `docs/उपयोग.md` सम्मिलितं भविष्यति।

## योगदानम्
- त्रुटि-सूचना, प्रस्तावाः, तथा उदाहरणाः देवनागरी-लिप्याः एव।

## अनुज्ञा
- परियोजना आरम्भिक-अवस्थायाम् अस्ति; अनुज्ञा-पत्रं शीघ्रं दास्यते।

---

## English Overview
- Script: Devanagari only for source; UTF‑8 NFC enforced.
- Numerals: Devanagari digits ०–९ (decimal only in v0.1).
- Statement terminator: danda `।`.
- Assignment: `स्थापय <name>, <value>`.
- Operators (word form): `योग/घट/गुण/भाग/सम/असम/लघु/महान्/लघु-सम/महान्-सम/च/वा/न`.
- Blocks: `आरम्भ … समाप्ति` (braces `{}` also accepted for now).
- Canonicalization: dual storage (surface + canonical), NFC + whitespace + punctuation normalization.

### Quick Example
```
कार्य मुख्य() आरम्भ
  स्थापय अ, ५। स्थापय ब, ७।
  यदि अ लघु ब तदा लिख("लघु") अन्यथा लिख("बृहत्")।
समाप्ति।
```

### Project Layout (high level)
- `src/कण्ठि/शब्दविभाजक.सं` — lexer (Devanagari digits, danda, word-operators)
- `src/कण्ठि/वाक्यविच्छेदक.सं` — parser skeleton
- `src/निर्गम/लेख_उत्पादक.सं` — bytecode generator (print/assign/list/map/loop)
- `src/यन्त्रमुख/व्याख्याता.सं` — interpreter skeleton
- `src/उदाहरण/प्रथम.सं` — “hello”
- `src/उदाहरण/फैक्टोरियल.सं` — recursion example

## Contributing (योगदानम्)
We welcome contributions in both Sanskrit and English.

1) Fork the repo and create a feature branch:
```bash
git checkout -b feature/<your-change>
```
2) Make edits with Sanskrit source; add bilingual docs when possible.
3) Commit with clear messages (Sanskrit or English):
```bash
git commit -m "Add: आरम्भ/समाप्ति block parsing (Sanskrit-only lexer)"
```
4) Push your branch and open a Pull Request against `main`.
```bash
git push origin feature/<your-change>
```
Guidelines:
- Keep source in Devanagari; docs may be bilingual.
- Preserve Phase 0 rules (danda terminators, word-operators, Devanagari digits).
- Add tests or examples if you change lexer/parser rules.

## Community & License
- Open source for everyone; respectful collaboration is expected.
- License: AGPL-3.0-or-later.
