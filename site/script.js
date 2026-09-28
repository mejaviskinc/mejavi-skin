/* ==========================================
       MEJAVI SKIN
       MULTI-PAGE WEBSITE
    ========================================== */

    let currentLanguage =
      localStorage.getItem("mejavi_language") || "id";

    let selectedProduct = null;
    let selectedVariant = 0;
    let selectedIngredient = null;


    /* ==========================================
       PRODUCT DATA

       CATATAN:
       GANTI LINK LYNK.ID DI BAWAH
       DENGAN LINK CHECKOUT ASLI.
    ========================================== */

    const products = [

      {
        id: "body-serum",

        category: {
          id: "Body Care",
          en: "Body Care"
        },

        name: {
          id: "Radiance Treatment Body Serum",
          en: "Radiance Treatment Body Serum"
        },

        image: "images/bodyserum.jpg",

        bpom: {
          number: "NA18250117959",
          registeredName: "MEJAVI SKIN + Radiance Treatment Body Serum",
          manufacturer: "SATU HATI UNTUK NEGERI",
          packaging: {
            id: "Tube + dus 100 mL; tube + dus 60 mL; tube 100 mL; tube 60 mL; botol + dus 100 mL.",
            en: "100 mL tube with box; 60 mL tube with box; 100 mL tube; 60 mL tube; 100 mL bottle with box."
          },
          validity: {
            id: "12 November 2025 – 11 November 2028",
            en: "November 12, 2025 – November 11, 2028"
          },
          certificate: "images/bpom/body-serum.jpg",
          verifyUrl: "https://cekbpom.pom.go.id/all-produk?query=NA18250117959"
        },

        description: {
          id:
            "Body serum untuk membantu merawat kulit tubuh agar terasa lembut, lembap dan tampak terawat.",

          en:
            "A body serum designed to help keep skin soft, moisturized and well cared for."
        },

        variants: [
          {
            size: "60gr",
            price: 69000,
            sku: "MJV006",

            /* GANTI LINK INI */
            lynk:
              "https://lynk.id/mejaviskinc/52op82k9dpej"
          },

          {
            size: "100gr",
            price: 129900,
            sku: "MJV005",

            /* GANTI LINK INI */
            lynk:
              "https://lynk.id/mejaviskinc/7xz8rxg3zydy"
          },

          {
            size: "250gr",
            price: 215000,
            sku: "MJV004",

            /* GANTI LINK INI */
            lynk:
              "https://lynk.id/mejaviskinc/xmj9pml0nw5r"
          }
        ],

        ingredients: {
          id:
            "Water, Sodium Acrylates Copolymer (and) Lecithin, Collagen, Panax Ginseng Root Extract, Niacinamide, Ethyl Ascorbic Acid, Glycyrrhiza Glabra (Licorice) Root Extract, Aloe Barbadensis Leaf Extract, Titanium Dioxide, Glycerin, Glyceryl Stearate, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Neopentyl Glycol Dicaprate/Dicaprate, Vaccinium Corymbosum (Blueberry) Fruit Water, WaterAqua (and) Xanthan Gum (and) Caprylyl Glycol (and) Phenoxyethanol (and) Glucose (and) Chondrus Crispus Extract (and) Ethylhexylglycerin, Tocopheryl Acetate (Vitamin E), Sodium DNA, Phenoxyethanol (and) Glyceryl Laurate, Fragrance, Carmoisine CI No. 14720, BrilliantBlue CI No. 42090, Erythrosine CI No. 45430.",

          en:
            "Water, Sodium Acrylates Copolymer (and) Lecithin, Collagen, Panax Ginseng Root Extract, Niacinamide, Ethyl Ascorbic Acid, Glycyrrhiza Glabra (Licorice) Root Extract, Aloe Barbadensis Leaf Extract, Titanium Dioxide, Glycerin, Glyceryl Stearate, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Neopentyl Glycol Dicaprate/Dicaprate, Vaccinium Corymbosum (Blueberry) Fruit Water, WaterAqua(and) Xanthan Gum (and) Caprylyl Glycol (and) Phenoxyethanol (and) Glucose (and) Chondrus Crispus Extract (and) Ethylhexylglycerin, Tocopheryl Acetate (Vitamin E), Sodium DNA, Phenoxyethanol (and) Glyceryl Laurate, Fragrance, Carmoisine CI No. 14720, BrilliantBlue CI No. 42090, Erythrosine CI No. 45430.."
        },

        benefits: {
          id:
            "MejaviSkin+ Body Serum dapat membantu mencerahkan kulit,membantu mengurangi kulit eksim,membantu menjaga kelembapan kulit,serta memiliki kandungan antioksidant yang dapat membantu menjaga kulit dari kerusakan akibat sinar matahari.",

          en:
            "MejaviSkin+ Body Serum helps brighten the appearance of the skin, helps reduce the appearance of eczema-prone skin, and helps maintain skin moisture. It also contains antioxidants that help protect the skin from damage caused by sun exposure.."
        },

        how: {
          id:
            "Tuangkan body serum secukupnya, kemudian aplikasikan secara merata pada area tangan dan area badan lain yang dikehendaki dengan menggunakan tangan,gunakan secara rutin setelah mandi untuk mendapatkan hasil yang maksimal",

          en:
            "Pour an adequate amount of body serum onto your hand, then apply evenly to the hands and other desired areas of the body. Use regularly after bathing for optimal results.."
        }
      },


      {
        id: "facial-foam",

        category: {
          id: "Face Cleanser",
          en: "Face Cleanser"
        },

        name: {
          id: "Brightening Gentle Cleanser",
          en: "Brightening Gentle Cleanser"
        },

        image: "images/cleaner.jpg",

        bpom: {
          number: "NA18251209959",
          registeredName: "MEJAVI SKIN + Brightening Gentle Cleanser",
          manufacturer: "SATU HATI UNTUK NEGERI",
          packaging: {
            id: "Botol + dus 50 mL; botol 60 mL.",
            en: "50 mL bottle with box; 60 mL bottle."
          },
          validity: {
            id: "13 November 2025 – 12 November 2028",
            en: "November 13, 2025 – November 12, 2028"
          },
          certificate: "images/bpom/gentle-cleanser.jpg",
          verifyUrl: "https://cekbpom.pom.go.id/all-produk?query=NA18251209959"
        },

        description: {
          id:
            "Facial foam untuk membantu membersihkan kulit wajah dari kotoran dan minyak berlebih.",

          en:
            "A facial cleanser designed to help remove dirt and excess oil from the face."
        },

        variants: [
          {
            size: "100gr",
            price: 89000,
            sku: "MJV002",

            /* GANTI LINK INI */
            lynk:
              "https://lynk.id/mejaviskinc/w9y2p9lermw4"
          }
        ],

        ingredients: {
          id:
            "Water, Sodium Hyaluronate, Coco-Glucoside, Cocamidopropyl Betaine, Glycerin, Aloe Barbadensis Leaf Extract, Green Tea Extract, Niacinamide, Centella Asiatica Extract, Panax Ginseng Root Extract, Benzyl Alcohol, Benzoic Acid, Dehydroacetic Acid, Ethylenediaminetetraacetic Acid, Jojoba Oil, Tea Tree Oil, PEG-40 Hydrogenated Castor Oil, Sodium Chloride, Pentylene Glycol, Methyl Diisopropyl Propionamide, Fragrance.",

          en:
            "Water, Sodium Hyaluronate, Coco-Glucoside, Cocamidopropyl Betaine, Glycerin, Aloe Barbadensis Leaf Extract, Green Tea Extract, Niacinamide, Centella Asiatica Extract, Panax Ginseng Root Extract, Benzyl Alcohol, Benzoic Acid, Dehydroacetic Acid, Ethylenediaminetetraacetic Acid, Jojoba Oil, Tea Tree Oil, PEG-40 Hydrogenated Castor Oil, Sodium Chloride, Pentylene Glycol, Methyl Diisopropyl Propionamide, Fragrance."
        },

        benefits: {
          id:
            "MejaviSkin+ Cleanser dapat digunakan untuk membersihkan wajah dari debu dan kotoran, dapat membantu menjaga kelembapan kulit, mencerahkan kulit, dan mengandung antioksidant yang dapat menyehatkan kulit.",

          en:
            "MejaviSkin+ Cleanser helps cleanse the face by removing dust, dirt, and impurities. It also helps maintain skin moisture, promotes a brighter-looking complexion, and contains antioxidants that help keep the skin healthy and well cared for."
        },

        how: {
          id:
            "Tuangkan MejaviSkin+ Cleanser ke tangan, kemudian aplikasikan ke seluruh wajah termasuk ke leher yang sebelumnya sudah dibasahi, pijat wajah dengan gerakan memutar yang lembut selama 1-2 menit, bilas dengan air sampai bersih, kemudian keringkan dengan handuk lembut",

          en:
            "Pour an appropriate amount of MejaviSkin+ Cleanser onto your palm. Apply evenly to the face and neck after wetting the skin. Gently massage in circular motions for 1–2 minutes. Rinse thoroughly with clean water, then gently pat dry with a soft towel."
        }
      },


      {
        id: "serum",

        category: {
          id: "Face Serum",
          en: "Face Serum"
        },

        name: {
          id: "Plump + Bright Serumizer",
          en: "Plump + Bright Serumizer"
        },

        image: "images/serum.jpg",

        bpom: {
          number: "NA18250117979",
          registeredName: "MEJAVI SKIN + Plump + Bright Serumizer",
          manufacturer: "SATU HATI UNTUK NEGERI",
          packaging: {
            id: "Botol + dus 20 mL.",
            en: "20 mL bottle with box."
          },
          validity: {
            id: "13 November 2025 – 12 November 2028",
            en: "November 13, 2025 – November 12, 2028"
          },
          certificate: "images/bpom/serumizer.jpg",
          verifyUrl: "https://cekbpom.pom.go.id/all-produk?query=NA18250117979"
        },

        description: {
          id:
            "Serum wajah dengan tekstur ringan untuk melengkapi rutinitas skincare harian.",

          en:
            "A lightweight facial serum created for your daily skincare routine."
        },

        variants: [
          {
            size: "20gr",
            price: 98000,
            sku: "MJV001",

           lynk:
          "https://lynk.id/mejaviskinc/gzv2qyn2v4xg"
          }
        ],

        ingredients: {
          id:
            "Water, Sodium Acrylates Copolymer (and) Lecithin, Coco-Caprylate/Caprate, Caprylic/Capric Triglyceride, Titanium Dioxide, Inulin, Niacinamide, Alpha-Arbutin, 3-O-Ethyl Ascorbic Acid (and) Polyglyceryl-10 Oleate (and) Polyglyceryl-6 Laurate (and) Sorbitan Palmitate (and) Magnolol (and) Honokiol andAqua, Glycerin, WaterAqua (and) Acetyl Hexapeptide-8 (and) Caprylyl Glycol, Water, Butylene Glycol, Glycerin, 1,2-Hexanediol, Ethyl Hexanediol, Lactobacillus Ferment, Goat Milk Extract, Glycerin (and) Water (and) Hydrolyzed Pea Protein (and) Glucose (and) Sodium Chloride (and) Sodium Succinate, WaterAqua) (and) Xanthan Gum (and) Caprylyl Glycol (and) Phenoxyethanol (and) Glucose (and) Chondrus Crispus Extract (and) Ethylhexylglycerin, Sodium DNA, Centella Asiatica Extract, Phenoxyethanol (and) Glyceryl Laurate, Fragrance.",

          en:
            "Water, Sodium Acrylates Copolymer (and) Lecithin, Coco-Caprylate/Caprate, Caprylic/Capric Triglyceride, Titanium Dioxide, Inulin, Niacinamide, Alpha-Arbutin, 3-O-Ethyl Ascorbic Acid (and) Polyglyceryl-10 Oleate (and) Polyglyceryl-6 Laurate (and) Sorbitan Palmitate (and) Magnolol (and) Honokiol (and)Aqua, Glycerin, WaterAqua (and) Acetyl Hexapeptide-8 (and) Caprylyl Glycol, Water, Butylene Glycol, Glycerin, 1,2-Hexanediol, Ethyl Hexanediol, Lactobacillus Ferment, Goat Milk Extract, Glycerin (and) Water (and) Hydrolyzed Pea Protein (and) Glucose (and) Sodium Chloride (and) Sodium Succinate, WaterAqua (and) Xanthan Gum (and) Caprylyl Glycol (and) Phenoxyethanol (and) Glucose (and) Chondrus Crispus Extract (and) Ethylhexylglycerin, Sodium DNA, Centella Asiatica Extract, Phenoxyethanol (and) Glyceryl Laurate, Fragrance."
        },

        benefits: {
          id:
            "MejaviSkin+ Fresh Hydra Creme dapat membantu mencerahkan kulit, membantu meratakan warna kulit, membantu menjaga kelembapan kulit, membantu mengurangi kerutan di kulit wajah, serta membantu melindungi kulit dari sinar UV.",

          en:
            "MejaviSkin+ Fresh Hydra Creme helps brighten the skin, promote a more even skin tone, maintain skin moisture, reduce the appearance of wrinkles on the face, and help protect the skin from UV exposure."
        },

        how: {
          id:
            "Ambil MejaviSkin+ Fresh Hydra Creme secukupnya, kemudian aplikasikan secara merata pada area wajah dengan menggunakan tangan, gunakan secara rutin 2 kali sehari pagi dan malam hari setelah mandi atau setelah membersihkan wajah.",

          en:
            "Take an adequate amount of MejaviSkin+ Fresh Hydra Creme and apply evenly to the face using clean hands. Use regularly twice a day, in the morning and at night, after bathing or cleansing the face."
        }
      },


      {
        id: "all-in-one",

        category: {
          id: "Face Cream",
          en: "Face Cream"
        },

        name: {
          id: "Fresh Hydra Cream",
          en: "Fresh Hydra Cream"
        },

        image: "images/cream.jpg",

        bpom: {
          number: "NA18250118206",
          registeredName: "MEJAVI SKIN + Fresh Hydra Cream",
          manufacturer: "SATU HATI UNTUK NEGERI",
          packaging: {
            id: "Pot + dus 30 g; pot + dus 20 g.",
            en: "30 g jar with box; 20 g jar with box."
          },
          validity: {
            id: "18 November 2025 – 17 November 2028",
            en: "November 18, 2025 – November 17, 2028"
          },
          certificate: "images/bpom/fresh-hydra-cream.jpg",
          verifyUrl: "https://cekbpom.pom.go.id/all-produk?query=NA18250118206"
        },

        description: {
          id:
            "Cream wajah untuk melengkapi perawatan kulit pagi dan malam.",

          en:
            "A facial cream designed to complement both morning and evening skincare routines."
        },

        variants: [
          {
            size: "Day & Night",
            price: 179900,
            sku: "MJV003",

            /* GANTI LINK INI */
            lynk:
              "https://lynk.id/mejaviskinc/lg28kl93gljv"
          }
        ],

        ingredients: {
          id:
            " Collagen,Niacinamide,Argireline• Lumicease, Ethyl Ascorbic Acid (EAA), Aloe Vera Extract,Lipomoist.",

          en:
            "Collagen,Niacinamide,Argireline• Lumicease, Ethyl Ascorbic Acid (EAA), Aloe Vera Extract,Lipomoist."
        },

        benefits: {
          id:
            "Krim pelembab (Daily Moisturizer) yang dapat mengurangi kulit eksim, mencerahkan kulit dan memiliki kandungan antioksidant yang baik untuk menyehatkan kulit.",

          en:
            "A daily moisturizing cream formulated to help soothe eczema-prone skin, brighten the skin, and provide antioxidant benefits that help maintain healthy-looking skin."
        },

        how: {
          id:
            "Bersihkan wajah terlebih dahulu, kemudian keringkan dengan lembut. Ambil Lumiere Essence Hydra Cream secukupnya, lalu aplikasikan secara merata pada wajah dan leher. Pijat lembut hingga krim terserap sempurna.Gunakan secara rutin pada pagi dan malam hari. Pada pagi hari, lanjutkan dengan penggunaan sunscreen untuk membantu melindungi kulit dari paparan sinar matahari.",

          en:
            "Cleanse your face thoroughly and gently pat dry. Apply an appropriate amount of Lumiere Essence Hydra Cream evenly to the face and neck. Gently massage until fully absorbed.Use regularly in the morning and evening. During daytime use, follow with sunscreen to help protect the skin from sun exposure."
        }
      },


      {
        id: "moisturizer",

        category: {
          id: "Moisturizer",
          en: "Moisturizer"
        },

        name: {
          id: "LUMIERE ESSENCE HYDRA CREAM",
          en: "LUMIERE ESSENCE HYDRA CREAM"
        },

        image: "images/moisturizer.jpg",

        bpom: {
          number: "NA18250117980",
          registeredName: "MEJAVI SKIN + Lumiere Essence Hydra Cream",
          manufacturer: "SATU HATI UNTUK NEGERI",
          packaging: {
            id: "Botol + dus 100 g; botol 100 mL.",
            en: "100 g bottle with box; 100 mL bottle."
          },
          validity: {
            id: "13 November 2025 – 12 November 2028",
            en: "November 13, 2025 – November 12, 2028"
          },
          certificate: "images/bpom/lumiere-hydra-cream.jpg",
          verifyUrl: "https://cekbpom.pom.go.id/all-produk?query=NA18250117980"
        },

        description: {
          id:
            "Moisturizer untuk membantu menjaga kulit tetap terasa lembap dan nyaman.",

          en:
            "A moisturizer designed to help keep the skin hydrated and comfortable."
        },

        variants: [
          {
            size: "35gr",
            price: 122000,
            sku: "MJV007",

            /* GANTI LINK INI */
            lynk:
              "https://lynk.id/mejaviskinc/k0o5l15r6dnk"
          }
        ],

        ingredients: {
          id:
            "Water, Niacinamide, Acetyl Hexapeptide-8, Caprylyl Glycol, Glycerin, Hydrolyzed Pea Protein, Glucose, Sodium Chloride, Sodium Succinate, Collagen, 3-O-Ethyl Ascorbic Acid, Polyglyceryl-10 Oleate, Polyglyceryl-6 Laurate, Sorbitan Palmitate, Magnolol, Honokiol, Sodium Acrylates Copolymer, Lecithin, Caprylic/Capric Triglyceride, Coco-Caprylate, Butylated Hydroxytoluene, Aloe Barbadensis Leaf Extract, Xanthan Gum, Phenoxyethanol, Chondrus Crispus Extract, Ethylhexylglycerin, Glyceryl Laurate, dan Fragrance.",

          en:
            "Water, Niacinamide, Acetyl Hexapeptide-8, Caprylyl Glycol, Glycerin, Hydrolyzed Pea Protein, Glucose, Sodium Chloride, Sodium Succinate, Collagen, 3-O-Ethyl Ascorbic Acid, Polyglyceryl-10 Oleate, Polyglyceryl-6 Laurate, Sorbitan Palmitate, Magnolol, Honokiol, Sodium Acrylates Copolymer, Lecithin, Caprylic/Capric Triglyceride, Coco-Caprylate, Butylated Hydroxytoluene, Aloe Barbadensis Leaf Extract, Xanthan Gum, Phenoxyethanol, Chondrus Crispus Extract, Ethylhexylglycerin, Glyceryl Laurate, and Fragrance."
        },

        benefits: {
          id:
            "Membantu mengurangi keluhan kulit eksim, membuat kulit terasa lebih lembut, membantu mencerahkan kulit, serta mengandung antioksidan yang membantu menjaga kulit dari kerusakan akibat sinar matahari.",

          en:
            "Helps reduce concerns associated with eczema-prone skin, leaves the skin feeling softer, helps brighten the skin, and contains antioxidants that help protect the skin from damage caused by sun exposure."
        },

        how: {
          id:
            "Gunakan Lumiere Essence Hydra Cream secukupnya pada wajah, kemudian aplikasikan secara merata. Gunakan secara rutin setelah memakai cleanser dan serum.",

          en:
            "Apply an appropriate amount of Lumiere Essence Hydra Cream to the face and spread evenly. Use regularly after applying cleanser and serum."
        }
      },


      {
        id: "herbal-relaxing",

        category: {
          id: "Special Care",
          en: "Special Care"
        },

        name: {
          id: "Herbal Relaxing Cream",
          en: "Herbal Relaxing Cream"
        },

        image: "images/herbal.jpg",

        bpom: {
          number: "NA18260101852",
          registeredName: "MEJAVI SKIN + Herbal Relaxing Cream",
          manufacturer: "SATU HATI UNTUK NEGERI",
          packaging: {
            id: "Tube 20 g; tube + dus 20 g; tube 35 g; tube + dus 35 g; tube 60 g; tube + dus 60 g; tube 100 g; tube + dus 100 g.",
            en: "20 g tube; 20 g tube with box; 35 g tube; 35 g tube with box; 60 g tube; 60 g tube with box; 100 g tube; 100 g tube with box."
          },
          validity: {
            id: "17 Februari 2026 – 16 Februari 2029",
            en: "February 17, 2026 – February 16, 2029"
          },
          certificate: "images/bpom/herbal-relaxing-cream.jpg",
          verifyUrl: "https://cekbpom.pom.go.id/all-produk?query=NA18260101852"
        },

        description: {
          id:
            "Herbal relaxing cream dengan botanical-inspired formulation untuk melengkapi perawatan harian.",

          en:
            "A botanical-inspired relaxing cream created to complement your daily care routine."
        },

        variants: [
          {
            size: "35gr",
            price: 68000,
            sku: "MJV008",

            /* GANTI LINK INI */
            lynk:
              "https://lynk.id/mejaviskinc/d8omkzk70l9j"
          }
        ],

        ingredients: {
          id:
            "Water, Sodium Acrylates Copolymer (and) Lecithin, Capric Triglyceride, Coco-Caprylate/Caprate, Menthol, Citronella Oil, Wintergreen Oil, Olea Europaea (Olive) Fruit Oil, Melaleuca Leucadendron Cajuputi Oil, PEG-40 Hydrogenated Castor Oil, Phenoxyethanol (and) Glyceryl Laurate, Fragrance.",

          en:
            "Water, Sodium Acrylates Copolymer (and) Lecithin, Capric Triglyceride, Coco-Caprylate/Caprate, Menthol, Citronella Oil, Wintergreen Oil, Olea Europaea (Olive) Fruit Oil, Melaleuca Leucadendron Cajuputi Oil, PEG-40 Hydrogenated Castor Oil, Phenoxyethanol (and) Glyceryl Laurate, Fragrance."
        },

        benefits: {
          id:
            "Memberikan sensasi hangat dan nyaman pada tubuh, membantu memperlancar peredaran darah saat proses pemijatan, serta memiliki aroma alami yang menenangkan untuk membantu tubuh terasa lebih rileks.",

          en:
            "Provides a warm and comfortable sensation that helps promote blood circulation during massage. Its natural, soothing aroma also helps the body feel more relaxed"
        },

        how: {
          id:
            "Gunakan secukupnya pada area yang dibutuhkan dan ratakan secara lembut.",

          en:
            "Apply an adequate amount to the desired area and gently spread."
        }
      },

      {
        id: "paket-lengkap",
        isBundle: true,
        category: {
          id: "Paket Perawatan",
          en: "Care Bundle"
        },
        name: {
          id: "Paket Lengkap",
          en: "Complete Care Bundle"
        },
        image: "images/paket-lengkap/Screenshot_20260911-223903.jpg",
        images: [
          "images/paket-lengkap/Screenshot_20260911-223903.jpg",
          "images/paket-lengkap/Screenshot_20260911-223724.jpg",
          "images/paket-lengkap/Screenshot_20260912-022414(1).jpg",
          "images/paket-lengkap/Screenshot_20260911-224125(1).jpg",
          "images/paket-lengkap/Screenshot_20260911-223738.jpg"
        ],
        description: {
          id: "Paket lengkap perawatan Mejavi Skin+ dengan harga spesial.",
          en: "A complete Mejavi Skin+ care bundle at a special price."
        },
        variants: [
          {
            size: "Paket Lengkap",
            price: 525980,
            originalPrice: 618800,
            sku: "MJV-BUNDLE-001",
            lynk: "https://lynk.id/mejaviskinc/5xgq3mx7wv5x"
          }
        ],
        benefits: {
          id: "Satu paket praktis untuk melengkapi rutinitas perawatan kulit wajah dan tubuh.",
          en: "A practical bundle to complete your face and body care routine."
        },
        ingredients: {
          id: "Komposisi mengikuti produk-produk yang terdapat dalam paket.",
          en: "Ingredients follow the individual products included in the bundle."
        },
        how: {
          id: "Pilih paket, tekan Beli melalui Lynk.id, lalu selesaikan data pengiriman dan pembayaran.",
          en: "Choose the bundle, tap Buy through Lynk.id, then complete shipping and payment details."
        }
      }

    ];

    window.mejaviProducts = products;


    /* ==========================================
       KEY INGREDIENTS

       Untuk mengubah bagian Ingredients, cukup
       edit data pada daftar ini saja. HTML kartu
       akan dibuat otomatis oleh JavaScript.
    ========================================== */

    const keyIngredients = [
      {
        icon: "◌",
        name: "Niacinamide",
        description: {
          id:
            "Niacinamide merupakan bentuk vitamin B3 yang dikenal sebagai bahan aktif sangat serbaguna dalam perawatan kulit. Bahan ini umumnya dapat digunakan oleh hampir semua jenis kulit, mulai dari kulit berminyak, kering, kombinasi, hingga kulit sensitif. Kegunaan utamanya meliputi membantu menjaga skin barrier, mempertahankan kelembapan, mengontrol tampilan minyak berlebih, serta merawat kulit kusam dan warna kulit tidak merata agar tampak lebih cerah, halus, dan sehat.",
          en:
            "Niacinamide is a form of vitamin B3 known as a highly versatile skincare active. It is generally suitable for almost all skin types, including oily, dry, combination, and sensitive skin. Its main uses include supporting the skin barrier, retaining moisture, managing the appearance of excess oil, and caring for dullness and uneven tone so skin looks brighter, smoother, and healthier."
        },
        details: {
          id: {
            intro: "Niacinamide adalah bentuk vitamin B3 yang larut dalam air dan dikenal sebagai salah satu bahan aktif paling serbaguna dalam produk perawatan kulit. Bahan ini umumnya dapat digunakan oleh hampir semua jenis kulit, mulai dari kulit berminyak, kering, kombinasi, hingga kulit sensitif. Pada kulit berminyak, niacinamide membantu merawat keseimbangan produksi minyak agar wajah tidak terlihat terlalu mengilap. Pada kulit kering, bahan ini mendukung fungsi skin barrier sehingga kelembapan kulit lebih terjaga dan kulit terasa lebih nyaman. Niacinamide juga membantu merawat tampilan pori-pori, tekstur kasar, kulit kusam, kemerahan, noda gelap, serta warna kulit yang tampak tidak merata. Dengan penggunaan rutin dalam formulasi yang sesuai, kulit dapat terlihat lebih halus, cerah, sehat, dan terawat. Meskipun umumnya memiliki toleransi yang baik, pemilik kulit sangat sensitif tetap dianjurkan melakukan patch test dan memperkenalkan produk secara bertahap.",
            benefits: ["Membantu memperkuat fungsi skin barrier", "Membantu menjaga kelembapan dan mengurangi kehilangan air", "Membantu menyamarkan tampilan noda gelap dan warna kulit tidak merata", "Membantu kulit tampak lebih halus", "Dapat membantu mengontrol tampilan minyak berlebih"],
            suitable: "Hampir semua jenis kulit, termasuk kulit berminyak, kering, kombinasi, kusam, warna kulit tidak merata, dan kulit sensitif.",
            note: "Meskipun umumnya dapat ditoleransi dengan baik, respons setiap kulit dapat berbeda. Untuk kulit sensitif, mulai secara bertahap, lakukan patch test, dan hentikan pemakaian jika timbul iritasi."
          },
          en: {
            intro: "Niacinamide is a water-soluble form of vitamin B3 and is known as one of the most versatile active ingredients in skincare. It is generally suitable for almost all skin types, including oily, dry, combination, and sensitive skin. For oily skin, niacinamide helps care for oil balance so the complexion appears less excessively shiny. For dry skin, it supports skin-barrier function so moisture is better retained and the skin feels more comfortable. Niacinamide also helps care for the appearance of pores, rough texture, dullness, redness, dark spots, and uneven-looking tone. With consistent use in a well-designed formula, the skin can appear smoother, brighter, healthier, and better cared for. Although it is generally well tolerated, people with highly sensitive skin should still patch test and introduce the product gradually.",
            benefits: ["Helps support the skin barrier", "Helps retain moisture and reduce water loss", "Helps improve the appearance of dark spots and uneven tone", "Helps skin look smoother", "May help reduce the appearance of excess oil"],
            suitable: "Almost all skin types, including oily, dry, combination, dull, uneven-looking, and sensitive skin.",
            note: "Although it is generally well tolerated, individual responses vary. Sensitive skin should introduce it gradually, patch test first, and stop use if irritation occurs."
          }
        },
        sources: [
          { title: "Niacinamide & skin barrier", url: "https://pubmed.ncbi.nlm.nih.gov/16209160/" },
          { title: "Niacinamide & hyperpigmentation", url: "https://pubmed.ncbi.nlm.nih.gov/12100180/" },
          { title: "Niacinamide clinical study", url: "https://pubmed.ncbi.nlm.nih.gov/16029679/" }
        ]
      },
      {
        icon: "💧",
        name: "Sodium Hyaluronate",
        description: {
          id:
            "Sodium Hyaluronate merupakan bentuk Hyaluronic Acid yang bekerja sebagai humektan untuk membantu menarik dan mempertahankan air pada permukaan kulit. Dengan kelembapan yang terjaga, kulit terasa lebih lembut, kenyal, nyaman, dan tampak segar sepanjang rutinitas perawatan harian.",
          en:
            "Sodium Hyaluronate is a form of Hyaluronic Acid that works as a humectant, helping attract and retain water on the skin's surface. With hydration maintained, the skin feels softer, plumper, more comfortable, and refreshed throughout an everyday skincare routine."
        },
        details: {
          id: {
            intro: "Sodium Hyaluronate adalah bentuk garam dari Hyaluronic Acid yang larut dalam air dan banyak digunakan dalam produk perawatan kulit sebagai humektan. Bahan ini membantu menarik serta mempertahankan air pada lapisan permukaan kulit sehingga kelembapan terasa lebih terjaga. Pada kulit kering atau dehidrasi, Sodium Hyaluronate membantu mengurangi sensasi tertarik dan membuat kulit terasa lebih lembut, kenyal, serta nyaman. Kondisi kulit yang terhidrasi juga dapat membantu tampilan garis-garis halus akibat kekurangan air terlihat lebih samar dan membuat permukaan kulit tampak lebih halus serta segar. Teksturnya umumnya ringan sehingga dapat digunakan pada kulit berminyak, kering, kombinasi, maupun sensitif. Agar hidrasi tidak cepat menguap, aplikasikan pada kulit yang sedikit lembap lalu lanjutkan dengan moisturizer untuk membantu mengunci kelembapan. Hasil akhirnya tetap dipengaruhi oleh konsentrasi, ukuran molekul, bahan pendamping, kondisi kulit, dan keseluruhan formulasi produk.",
            benefits: ["Membantu meningkatkan hidrasi kulit", "Membantu kulit terasa lebih lembut dan kenyal", "Membantu mengurangi rasa tertarik akibat kulit kering", "Mendukung tampilan garis halus akibat dehidrasi agar tersamarkan", "Memberi rasa nyaman tanpa terasa berat"],
            suitable: "Semua jenis kulit, terutama kulit kering atau dehidrasi.",
            note: "Gunakan pada kulit yang sedikit lembap dan lanjutkan dengan moisturizer untuk membantu mengunci kelembapan."
          },
          en: {
            intro: "Sodium Hyaluronate is the water-soluble salt form of Hyaluronic Acid and is widely used in skincare as a humectant. It helps attract and retain water at the skin's surface so moisture feels better maintained. On dry or dehydrated skin, Sodium Hyaluronate can help ease tightness and leave the skin feeling softer, plumper, and more comfortable. Improved hydration can also soften the appearance of fine dehydration lines and give the surface a smoother, fresher look. Its generally lightweight feel makes it suitable for oily, dry, combination, and sensitive skin. To reduce moisture evaporation, apply it to slightly damp skin and follow with a moisturizer that helps seal in hydration. Results still depend on concentration, molecular size, supporting ingredients, skin condition, and the complete product formulation.",
            benefits: ["Helps improve skin hydration", "Helps skin feel softer and plumper", "Helps relieve tightness associated with dryness", "Supports a smoother look for dehydration lines", "Provides lightweight comfort"],
            suitable: "All skin types, especially dry or dehydrated skin.",
            note: "Apply to slightly damp skin and follow with moisturizer to help seal in hydration."
          }
        },
        sources: [
          { title: "Topical hyaluronic acid study", url: "https://pubmed.ncbi.nlm.nih.gov/22052267/" },
          { title: "Sodium Hyaluronate formulations", url: "https://pubmed.ncbi.nlm.nih.gov/24724824/" }
        ]
      },
      {
        icon: "🌿",
        name: "Aloe Vera Extract",
        description: {
          id:
            "Aloe Vera Extract dikenal karena sifatnya yang menenangkan dan melembapkan. Kandungan ini membantu menjaga kulit terasa sejuk dan nyaman, mengurangi rasa kering, serta mendukung kondisi kulit agar tetap lembut dan terawat setelah aktivitas harian maupun paparan lingkungan.",
          en:
            "Aloe Vera Extract is known for its soothing and moisturizing properties. It helps the skin feel cool and comfortable, relieves feelings of dryness, and supports soft, cared-for skin after daily activities and exposure to environmental conditions."
        },
        details: {
          id: {
            intro: "Aloe Vera Extract berasal dari tanaman Aloe barbadensis dan telah lama digunakan dalam kosmetik sebagai bahan yang membantu menenangkan sekaligus menjaga kelembapan kulit. Gel tanaman ini mengandung air, polisakarida, serta berbagai komponen alami yang membantu kulit terasa lebih sejuk, lembut, dan nyaman ketika mengalami rasa kering atau tertarik. Dalam formulasi yang sesuai, Aloe Vera Extract mendukung kondisi skin barrier, membantu mempertahankan hidrasi, dan merawat kulit setelah aktivitas harian atau paparan lingkungan. Teksturnya biasanya ringan sehingga dapat digunakan oleh beragam jenis kulit, termasuk kulit berminyak, kering, kombinasi, dan sensitif. Meski dikenal lembut, ekstrak tumbuhan tetap dapat menimbulkan sensitivitas pada sebagian orang. Karena itu, lakukan patch test terlebih dahulu, perkenalkan produk secara bertahap, dan hentikan pemakaian bila muncul rasa perih, gatal, atau kemerahan yang menetap.",
            benefits: ["Membantu menenangkan kulit yang terasa tidak nyaman", "Membantu mempertahankan kelembapan", "Membantu kulit terasa lebih sejuk dan segar", "Mendukung kulit terasa lembut", "Membantu merawat kulit setelah terpapar lingkungan"],
            suitable: "Kulit kering, terasa tidak nyaman, atau membutuhkan hidrasi ringan.",
            note: "Ekstrak tumbuhan tetap dapat memicu sensitivitas pada sebagian orang; lakukan patch test terlebih dahulu."
          },
          en: {
            intro: "Aloe Vera Extract comes from Aloe barbadensis and has long been used in cosmetics to help soothe the skin while supporting moisture. The plant gel contains water, polysaccharides, and other naturally occurring components that can help dry or tight-feeling skin feel cooler, softer, and more comfortable. In a suitable formulation, Aloe Vera Extract supports the skin barrier, helps maintain hydration, and cares for skin after daily activity or environmental exposure. Its texture is usually lightweight, making it useful across oily, dry, combination, and sensitive skin types. Although it is generally considered gentle, plant extracts may still trigger sensitivity in some people. Patch test first, introduce the product gradually, and stop use if persistent stinging, itching, or redness develops.",
            benefits: ["Helps soothe uncomfortable-feeling skin", "Helps maintain moisture", "Helps skin feel cool and refreshed", "Supports a softer skin feel", "Helps care for skin after environmental exposure"],
            suitable: "Dry or uncomfortable-feeling skin, or anyone seeking lightweight hydration.",
            note: "Plant extracts may still cause sensitivity for some people; patch test before use."
          }
        },
        sources: [
          { title: "Aloe vera dermatology review", url: "https://pubmed.ncbi.nlm.nih.gov/18794775/" },
          { title: "Aloe vera & skin hydration", url: "https://pubmed.ncbi.nlm.nih.gov/19882025/" }
        ]
      },
      {
        icon: "✦",
        name: "Collagen",
        description: {
          id:
            "Collagen dalam produk perawatan topikal berperan sebagai bahan skin-conditioning yang membantu mempertahankan kelembapan pada permukaan kulit. Pemakaian secara rutin membantu kulit terasa lebih lembut, halus, dan kenyal sekaligus membuat tampilannya terlihat lebih terawat.",
          en:
            "In topical skincare, Collagen acts as a skin-conditioning ingredient that helps retain moisture on the skin's surface. With regular use, it helps the skin feel softer, smoother, and more supple while supporting a well-cared-for appearance."
        },
        details: {
          id: {
            intro: "Collagen merupakan protein struktural yang secara alami terdapat di dalam tubuh dan berperan penting pada kekuatan serta elastisitas kulit. Namun, ketika digunakan dalam skincare topikal, collagen terutama bekerja di permukaan sebagai bahan skin-conditioning dan pembentuk lapisan tipis yang membantu mempertahankan air. Lapisan tersebut membantu mengurangi rasa kering sehingga kulit terasa lebih lembut, halus, kenyal, dan tampak lebih terawat. Manfaat ini berasal dari dukungan kelembapan serta perbaikan kondisi permukaan kulit, bukan karena collagen yang dioleskan langsung menggantikan atau membangun kembali collagen alami di lapisan kulit yang lebih dalam. Efek produk juga dipengaruhi oleh jenis collagen, ukuran molekul, konsentrasi, dan perpaduannya dengan humektan atau emolien lain. Pemakaian rutin dapat membantu menjaga kenyamanan kulit, tetapi hasil setiap orang tetap dapat berbeda sesuai kondisi kulit dan keseluruhan formulasi.",
            benefits: ["Membantu menjaga kelembapan permukaan kulit", "Membantu kulit terasa lebih lembut", "Mendukung tampilan kulit yang lebih halus", "Membantu kulit terasa lebih kenyal", "Memberi efek skin-conditioning"],
            suitable: "Kulit kering, kasar, atau yang membutuhkan perawatan kelembapan tambahan.",
            note: "Collagen topikal tidak sama dengan menggantikan collagen alami di dalam kulit; manfaat utamanya bergantung pada formulasi produk."
          },
          en: {
            intro: "Collagen is a structural protein naturally found in the body and plays an important role in skin strength and elasticity. When used in topical skincare, however, collagen mainly works at the surface as a skin-conditioning and film-forming ingredient that helps retain water. This light layer can reduce dry sensations so the skin feels softer, smoother, more supple, and better cared for. These benefits come from moisture support and improved surface condition, not because applied collagen directly replaces or rebuilds natural collagen in deeper skin layers. Product performance also depends on the collagen type, molecular size, concentration, and its combination with other humectants or emollients. Consistent use may help maintain skin comfort, although results still vary with individual skin condition and the complete formulation.",
            benefits: ["Helps retain surface moisture", "Helps skin feel softer", "Supports a smoother appearance", "Helps skin feel more supple", "Provides skin-conditioning benefits"],
            suitable: "Dry, rough-feeling skin or skin needing extra moisture care.",
            note: "Topical collagen does not replace the skin's natural collagen; its benefits depend on the complete product formula."
          }
        },
        sources: [
          { title: "Topical hydrolyzed proteins study", url: "https://pubmed.ncbi.nlm.nih.gov/30834689/" },
          { title: "Collagen-based products review", url: "https://pubmed.ncbi.nlm.nih.gov/40720447/" }
        ]
      },
      {
        icon: "🌾",
        name: "Licorice Extract",
        description: {
          id:
            "Licorice Extract atau ekstrak akar manis banyak digunakan untuk membantu merawat tampilan kulit kusam dan warna kulit yang tidak merata. Kandungan alaminya juga memiliki sifat antioksidan yang membantu menjaga kulit dari pengaruh buruk lingkungan sehingga tampak lebih cerah dan segar.",
          en:
            "Licorice Extract is commonly used to help care for dull-looking skin and the appearance of uneven skin tone. Its natural antioxidant properties also help protect the skin from environmental stressors, leaving it looking brighter, fresher, and more radiant."
        },
        details: {
          id: {
            intro: "Licorice Extract atau ekstrak akar manis berasal dari tanaman Glycyrrhiza dan mengandung berbagai senyawa alami, termasuk glabridin dan liquiritin, yang banyak dipelajari dalam perawatan kulit. Kandungan tersebut digunakan untuk membantu merawat tampilan noda gelap, kulit kusam, serta warna kulit yang terlihat tidak merata sehingga wajah tampak lebih cerah dan segar secara bertahap. Sifat antioksidannya membantu menjaga kulit dari stres lingkungan, sedangkan karakter menenangkannya dapat mendukung perawatan kulit yang tampak kemerahan atau kurang nyaman. Licorice Extract dapat digunakan pada beragam jenis kulit, tetapi hasilnya sangat dipengaruhi oleh kualitas ekstrak, konsentrasi, bahan pendamping, dan formula produk akhir. Perubahan tampilan pigmentasi membutuhkan penggunaan yang konsisten dan tidak terjadi secara instan. Gunakan sunscreen pada siang hari serta lakukan patch test karena ekstrak tumbuhan tetap berpotensi menimbulkan sensitivitas pada sebagian orang.",
            benefits: ["Membantu kulit tampak lebih cerah", "Membantu merawat tampilan noda gelap", "Mendukung warna kulit tampak lebih merata", "Memberikan dukungan antioksidan", "Membantu menenangkan tampilan kulit yang kemerahan"],
            suitable: "Kulit kusam, warna kulit tidak merata, atau tampak kemerahan.",
            note: "Sebagian bukti berasal dari studi laboratorium; hasil pada kulit dapat berbeda sesuai konsentrasi dan formulasi."
          },
          en: {
            intro: "Licorice Extract comes from Glycyrrhiza root and contains naturally occurring compounds, including glabridin and liquiritin, that are widely studied in skincare. These components are used to help care for the appearance of dark spots, dullness, and uneven-looking tone so the complexion can gradually appear brighter and fresher. Its antioxidant properties help protect against environmental stress, while its soothing character can support skin that appears red or feels uncomfortable. Licorice Extract may suit many skin types, but results depend greatly on extract quality, concentration, supporting ingredients, and the finished formula. Visible pigmentation care requires consistent use and does not happen instantly. Use sunscreen during the day and patch test first because plant extracts may still trigger sensitivity in some people.",
            benefits: ["Helps skin look brighter", "Helps improve the appearance of dark spots", "Supports a more even-looking tone", "Provides antioxidant support", "Helps calm the appearance of redness"],
            suitable: "Dull, uneven-looking, or redness-prone skin.",
            note: "Some evidence comes from laboratory studies; skin results vary with concentration and formulation."
          }
        },
        sources: [
          { title: "Glabridin & melanogenesis study", url: "https://pubmed.ncbi.nlm.nih.gov/9870547/" },
          { title: "Natural depigmentation review", url: "https://pubmed.ncbi.nlm.nih.gov/31269882/" }
        ]
      },
      {
        icon: "♡",
        name: "Ethyl Ascorbic Acid",
        description: {
          id:
            "Ethyl Ascorbic Acid merupakan derivatif vitamin C yang stabil dan berfungsi sebagai antioksidan dalam formulasi skincare. Bahan ini membantu merawat kulit kusam, mendukung tampilan warna kulit yang lebih merata, serta membuat kulit terlihat lebih cerah, segar, dan bercahaya.",
          en:
            "Ethyl Ascorbic Acid is a stable vitamin C derivative that works as an antioxidant in skincare formulas. It helps care for dull-looking skin, supports a more even-looking skin tone, and leaves the complexion appearing brighter, fresher, and more radiant."
        },
        details: {
          id: {
            intro: "Ethyl Ascorbic Acid atau 3-O-Ethyl Ascorbic Acid merupakan derivatif vitamin C yang dirancang memiliki stabilitas lebih baik untuk digunakan dalam formulasi skincare. Sebagai antioksidan, bahan ini membantu merawat kulit dari pengaruh radikal bebas yang dapat membuat tampilan kulit terlihat kusam dan kurang segar. Kandungan ini juga digunakan untuk membantu menyamarkan tampilan noda gelap, mendukung warna kulit yang terlihat lebih merata, serta membuat kulit tampak lebih cerah dan bercahaya bila digunakan secara rutin dalam formula yang sesuai. Hasilnya tidak hanya bergantung pada satu bahan, tetapi juga pada konsentrasi, pH, kemasan, penyimpanan, dan kombinasi bahan di dalam produk. Vitamin C dapat terasa cukup aktif pada sebagian kulit sensitif, sehingga sebaiknya diperkenalkan secara bertahap dan diawali dengan patch test. Gunakan sunscreen setiap pagi karena perlindungan terhadap sinar matahari sangat penting dalam rutinitas perawatan kulit kusam dan pigmentasi.",
            benefits: ["Memberikan dukungan antioksidan", "Membantu kulit tampak lebih cerah", "Membantu menyamarkan tampilan noda gelap", "Mendukung warna kulit tampak lebih merata", "Membantu merawat kulit yang terlihat kusam"],
            suitable: "Kulit kusam, memiliki tampilan noda gelap, atau warna kulit tidak merata.",
            note: "Vitamin C dapat terasa aktif pada kulit sensitif. Mulai bertahap, gunakan sunscreen pada siang hari, dan hentikan bila iritasi muncul."
          },
          en: {
            intro: "Ethyl Ascorbic Acid, or 3-O-Ethyl Ascorbic Acid, is a vitamin C derivative designed for improved stability in skincare formulations. As an antioxidant, it helps care for skin affected by free-radical stress that can contribute to a dull or tired-looking complexion. It is also used to help improve the appearance of dark spots, support a more even-looking tone, and leave the skin appearing brighter and more radiant with consistent use in a suitable formula. Results depend not only on this single ingredient but also on concentration, pH, packaging, storage, and its combination with other ingredients. Vitamin C can feel active on some sensitive skin, so introduce it gradually and patch test first. Use sunscreen every morning because sun protection is essential when caring for dullness and visible pigmentation.",
            benefits: ["Provides antioxidant support", "Helps skin look brighter", "Helps improve the appearance of dark spots", "Supports a more even-looking tone", "Helps care for dull-looking skin"],
            suitable: "Dull skin, visible dark spots, or uneven-looking tone.",
            note: "Vitamin C may feel active on sensitive skin. Introduce gradually, use sunscreen during the day, and stop if irritation occurs."
          }
        },
        sources: [
          { title: "3-O-Ethyl Ascorbic Acid study", url: "https://pubmed.ncbi.nlm.nih.gov/34314818/" },
          { title: "Topical vitamin C review", url: "https://pubmed.ncbi.nlm.nih.gov/37128827/" }
        ]
      },
      {
        icon: "🧬",
        name: "DNA Salmon",
        description: {
          id:
            "DNA Salmon pada kosmetik umumnya merujuk pada Sodium DNA atau bahan berbasis fragmen DNA yang dimurnikan. Dalam formulasi skincare, bahan ini digunakan untuk membantu menjaga kelembapan, merawat skin barrier, dan mendukung tampilan kulit agar terasa lebih halus, kenyal, dan terawat.",
          en:
            "Salmon DNA in cosmetics commonly refers to Sodium DNA or purified DNA-fragment-based ingredients. In skincare formulations, it is used to help maintain moisture, support the skin barrier, and promote smoother, more supple, well-cared-for-looking skin."
        },
        details: {
          id: {
            intro: "DNA Salmon adalah istilah yang sering digunakan dalam kosmetik untuk menyebut Sodium DNA atau bahan berbasis fragmen DNA yang telah dimurnikan; pada beberapa konteks istilah ini juga dikaitkan dengan PDRN atau polydeoxyribonucleotide. Dalam produk skincare oles, bahan tersebut terutama digunakan sebagai skin-conditioning untuk membantu mempertahankan kelembapan, mendukung kenyamanan skin barrier, serta membuat permukaan kulit terasa lebih halus, lembut, dan kenyal. Penelitian mengenai PDRN dan bahan berbasis DNA masih terus berkembang, tetapi hasil dari penggunaan medis atau prosedur injeksi tidak dapat disamakan langsung dengan hasil kosmetik topikal. Manfaat pada produk oles tetap bergantung pada bentuk bahan, konsentrasi, kemampuan formulasi mengantarkan bahan, serta kombinasi dengan kandungan lain. Bahan ini tidak boleh dianggap sebagai pengganti perawatan medis. Pengguna yang memiliki alergi ikan atau salmon sebaiknya berhati-hati, melakukan patch test, dan menghentikan penggunaan bila muncul reaksi yang tidak nyaman.",
            benefits: ["Membantu menjaga kelembapan kulit", "Mendukung fungsi skin barrier", "Membantu kulit terasa lebih halus dan kenyal", "Mendukung tampilan kulit yang terawat", "Berpotensi membantu proses perawatan kulit berdasarkan riset PDRN yang masih berkembang"],
            suitable: "Kulit kering, terasa kasar, atau membutuhkan perawatan barrier dan kelembapan tambahan.",
            note: "Bukti untuk kosmetik oles masih berkembang dan tidak sama dengan prosedur PDRN injeksi. Hindari bila memiliki alergi ikan atau salmon, lakukan patch test, dan hentikan bila timbul iritasi."
          },
          en: {
            intro: "Salmon DNA is a term commonly used in cosmetics for Sodium DNA or ingredients based on purified DNA fragments; in some contexts, it is also associated with PDRN, or polydeoxyribonucleotide. In topical skincare, these ingredients are mainly used for skin conditioning to help retain moisture, support skin-barrier comfort, and leave the surface feeling smoother, softer, and more supple. Research on PDRN and DNA-based materials is still developing, but findings from medical use or injectable procedures cannot be directly equated with results from a topical cosmetic. Benefits in leave-on products still depend on ingredient form, concentration, formulation delivery, and supporting ingredients. It should not be treated as a substitute for medical care. People with fish or salmon allergies should use caution, patch test first, and stop use if an uncomfortable reaction occurs.",
            benefits: ["Helps maintain skin moisture", "Supports skin-barrier function", "Helps skin feel smoother and more supple", "Supports a well-cared-for appearance", "May support skin-care processes based on still-developing PDRN research"],
            suitable: "Dry or rough-feeling skin, or skin needing additional barrier and moisture care.",
            note: "Evidence for topical cosmetics is still developing and is not equivalent to injectable PDRN procedures. Avoid if you have a fish or salmon allergy, patch test first, and stop if irritation occurs."
          }
        },
        sources: [
          { title: "PDRN pharmacology review", url: "https://pubmed.ncbi.nlm.nih.gov/28491036/" },
          { title: "PDRN & skin-barrier research", url: "https://pubmed.ncbi.nlm.nih.gov/37959659/" }
        ]
      },
      {
        icon: "☀",
        name: "Titanium Dioxide",
        description: {
          id:
            "Titanium Dioxide adalah mineral yang digunakan dalam kosmetik sebagai pigmen putih, opacifier, dan pada formulasi sunscreen tertentu sebagai UV filter anorganik. Fungsinya pada produk bergantung pada bentuk bahan, kadar, dan keseluruhan formulasi.",
          en:
            "Titanium Dioxide is a mineral used in cosmetics as a white pigment, an opacifier, and in certain sunscreen formulations as an inorganic UV filter. Its function depends on the ingredient form, concentration, and complete formulation."
        },
        details: {
          id: {
            intro: "Titanium Dioxide (TiO₂) merupakan mineral anorganik yang banyak digunakan dalam kosmetik sebagai pigmen putih dan opacifier untuk memberikan warna, daya tutup, serta konsistensi visual pada produk. Pada sunscreen yang memang diformulasikan dan diuji secara khusus, Titanium Dioxide juga dapat berfungsi sebagai filter UV dengan membantu menyerap dan menyebarkan radiasi ultraviolet, terutama pada rentang UVB dan sebagian UVA. Namun, keberadaan bahan ini dalam daftar ingredients tidak otomatis membuat suatu produk menjadi sunscreen atau memiliki tingkat perlindungan tertentu. Nilai SPF dan PA hanya dapat ditentukan melalui pengujian terhadap produk akhir karena perlindungan dipengaruhi oleh kadar, ukuran serta pelapisan partikel, pemerataan bahan, dan keseluruhan formula. Dalam produk topikal yang sesuai, bahan ini umumnya digunakan dengan toleransi kulit yang baik. Penilaian pemakaian pada kulit berbeda dari risiko menghirup bentuk bubuk atau aerosol, sehingga produk yang dapat terhirup memerlukan perhatian khusus.",
            benefits: ["Memberikan warna putih dan efek opak pada formulasi", "Membantu meratakan tampilan warna produk pada kulit", "Dapat berfungsi sebagai UV filter pada sunscreen yang sesuai", "Memberikan perlindungan terutama pada spektrum UVB", "Umumnya memiliki toleransi kulit yang baik saat digunakan sesuai formulasi"],
            suitable: "Berbagai jenis kulit sesuai fungsi dan formulasi produk akhirnya.",
            note: "Keberadaan Titanium Dioxide dalam daftar ingredients tidak otomatis membuat produk menjadi sunscreen. Perlindungan UV hanya boleh dinilai dari produk yang memiliki klaim SPF/PA dan telah melalui pengujian resmi. Hindari menghirup bentuk bubuk atau semprotan."
          },
          en: {
            intro: "Titanium Dioxide (TiO₂) is an inorganic mineral widely used in cosmetics as a white pigment and opacifier that provides color, coverage, and visual consistency. In sunscreens specifically formulated and tested for protection, Titanium Dioxide can also act as a UV filter by absorbing and scattering ultraviolet radiation, particularly UVB and part of the UVA range. However, its presence in an ingredient list does not automatically make a product a sunscreen or establish a specific level of protection. SPF and PA values must come from finished-product testing because performance depends on concentration, particle size and coating, ingredient distribution, and the complete formula. In suitable topical products, it is generally used with good skin tolerability. Safety assessment for application to the skin is different from inhalation risk, so powders or aerosol products that may be breathed in require special care.",
            benefits: ["Provides white color and opacity", "Helps create an even-looking cosmetic finish", "Can act as a UV filter in appropriate sunscreen formulas", "Provides stronger protection in the UVB range", "Generally well tolerated on skin when properly formulated"],
            suitable: "A wide range of skin types, depending on the finished product's purpose and formulation.",
            note: "Titanium Dioxide appearing in an ingredient list does not automatically make a product a sunscreen. UV protection should only be inferred from products carrying tested SPF/PA claims. Avoid inhaling powder or spray forms."
          }
        },
        sources: [
          { title: "Inorganic UV filters review", url: "https://pubmed.ncbi.nlm.nih.gov/30444533/" },
          { title: "Titanium Dioxide cosmetic safety", url: "https://pubmed.ncbi.nlm.nih.gov/31588611/" }
        ]
      }
    ];

    const ingredientResearch = {
      "Niacinamide": {
        id: {
          studied: "Niacinamide telah diteliti melalui uji penggunaan topikal pada manusia untuk melihat pengaruhnya terhadap fungsi barrier, kehilangan air dari kulit, hiperpigmentasi, tekstur, garis halus, kemerahan, dan produksi sebum. Sejumlah penelitian menggunakan formulasi dengan kadar sekitar 2–5% selama beberapa minggu.",
          findings: "Hasil penelitian menunjukkan bahwa niacinamide dapat membantu meningkatkan pembentukan komponen penting pada barrier kulit, mengurangi kehilangan air, serta memperbaiki tampilan noda gelap dan warna kulit yang tidak merata. Studi lain melaporkan perbaikan pada tampilan garis halus, kemerahan, elastisitas, dan minyak wajah setelah penggunaan rutin.",
          limits: "Manfaat tersebut tidak berarti semua produk niacinamide akan memberikan hasil yang sama. Konsentrasi, pH, bahan pendamping, stabilitas formula, lama pemakaian, dan kondisi kulit sangat memengaruhi hasil. Niacinamide merupakan bahan kosmetik pendukung dan bukan pengganti pemeriksaan dokter untuk gangguan pigmentasi atau penyakit kulit."
        },
        en: {
          studied: "Topical niacinamide has been studied in human-use trials assessing skin-barrier function, transepidermal water loss, hyperpigmentation, texture, fine lines, redness, and sebum production. Several studies used formulas containing approximately 2–5% niacinamide over a number of weeks.",
          findings: "Research suggests that niacinamide can support the production of important skin-barrier components, reduce water loss, and improve the appearance of dark spots and uneven tone. Other studies reported improvements in visible fine lines, redness, elasticity, and facial oil after consistent use.",
          limits: "These findings do not mean that every niacinamide product produces identical results. Concentration, pH, supporting ingredients, formula stability, duration of use, and individual skin condition all matter. Niacinamide is a cosmetic-support ingredient and does not replace medical care for pigmentation disorders or skin disease."
        }
      },
      "Sodium Hyaluronate": {
        id: {
          studied: "Penelitian topikal Hyaluronic Acid dan Sodium Hyaluronate terutama menilai kemampuan humektan dalam meningkatkan kadar air lapisan terluar kulit, elastisitas, kekasaran, dan tampilan garis halus akibat dehidrasi. Sodium Hyaluronate adalah bentuk garam yang lebih mudah digunakan dalam formulasi berbasis air.",
          findings: "Uji kosmetik pada manusia menunjukkan peningkatan hidrasi kulit dan, pada beberapa formula, perbaikan elastisitas serta kedalaman kerutan setelah pemakaian rutin. Efek yang paling konsisten adalah kulit terasa lebih lembap, lembut, dan nyaman karena bahan ini membantu mengikat air pada permukaan kulit.",
          limits: "Ukuran molekul sangat memengaruhi lokasi kerja dan sensasi bahan. Sodium Hyaluronate bukan filler dan produk oles tidak memberikan hasil yang sama dengan prosedur injeksi. Pada udara sangat kering, manfaat terbaik biasanya diperoleh dengan mengaplikasikannya pada kulit sedikit lembap lalu mengunci kelembapan menggunakan moisturizer."
        },
        en: {
          studied: "Topical Hyaluronic Acid and Sodium Hyaluronate research mainly evaluates humectant effects on outer-layer water content, elasticity, roughness, and the appearance of dehydration-related fine lines. Sodium Hyaluronate is a salt form that is convenient for water-based formulations.",
          findings: "Human cosmetic-use studies report improved hydration and, in some formulas, improvements in elasticity and wrinkle depth after regular application. The most consistent effect is softer, more comfortable-feeling skin because the ingredient helps bind water at the surface.",
          limits: "Molecular size strongly affects where and how the ingredient works. Sodium Hyaluronate is not a filler, and topical products do not produce the same results as injectable procedures. In very dry air, it is generally best applied to slightly damp skin and sealed with a moisturizer."
        }
      },
      "Aloe Vera Extract": {
        id: {
          studied: "Aloe vera telah diteliti untuk penggunaan dermatologis karena mengandung polisakarida dan berbagai senyawa tanaman. Kajian ilmiah membahas potensinya dalam menjaga hidrasi, memberi efek menenangkan, mendukung pemulihan barrier, dan membantu kondisi kulit tertentu.",
          findings: "Pada kosmetik, bukti paling masuk akal mendukung fungsinya sebagai bahan pelembap dan penenang yang membantu mengurangi rasa kering atau tidak nyaman. Beberapa penelitian juga menunjukkan potensi dukungan terhadap proses pemulihan kulit, meskipun hasilnya bergantung pada jenis ekstrak dan formulasi.",
          limits: "Komposisi Aloe Vera Extract dapat berbeda menurut spesies, bagian tanaman, proses ekstraksi, dan kadar bahan aktif. Klaim penyembuhan luka atau penyakit tidak boleh langsung diterapkan pada kosmetik biasa. Ekstrak tanaman juga tetap dapat memicu alergi atau iritasi pada sebagian pengguna."
        },
        en: {
          studied: "Aloe vera has been investigated for dermatologic use because it contains polysaccharides and multiple plant compounds. Scientific reviews discuss its potential roles in hydration, soothing, barrier recovery, and support for certain skin conditions.",
          findings: "For cosmetics, the most reasonable evidence supports its use as a moisturizing and soothing ingredient that may reduce dry or uncomfortable sensations. Some research also suggests support for skin-recovery processes, although results depend on the extract type and formulation.",
          limits: "Aloe Vera Extract composition varies with species, plant part, extraction process, and active concentration. Wound-healing or disease-treatment claims cannot automatically be transferred to an ordinary cosmetic product. Plant extracts may also trigger allergy or irritation in some users."
        }
      },
      "Collagen": {
        id: {
          studied: "Penelitian collagen dalam perawatan kulit perlu dibedakan antara collagen yang diminum, disuntikkan, dan dioleskan. Untuk kosmetik topikal, penelitian lebih relevan menilai fungsi film-forming, skin-conditioning, hidrasi permukaan, dan penggunaan hydrolyzed collagen atau peptide berukuran lebih kecil.",
          findings: "Formulasi topikal yang mengandung protein terhidrolisis atau peptide dilaporkan dapat meningkatkan kadar air pada stratum corneum dan membantu elastisitas pada kondisi penelitian tertentu. Collagen berukuran besar terutama membentuk lapisan yang membantu kulit terasa lebih lembut, halus, dan tidak cepat kehilangan kelembapan.",
          limits: "Collagen yang dioleskan tidak otomatis masuk ke dermis atau menggantikan collagen alami kulit. Bukti suplemen collagen oral tidak boleh digunakan untuk membuktikan manfaat krim. Hasil kosmetik sangat tergantung pada bentuk collagen, ukuran molekul, bahan pendamping, serta keseluruhan formulasi."
        },
        en: {
          studied: "Collagen research must distinguish between oral, injectable, and topical use. For topical cosmetics, the most relevant studies examine film-forming, skin-conditioning, surface hydration, and smaller hydrolyzed collagen or peptide ingredients.",
          findings: "Topical formulations containing hydrolyzed proteins or peptides have been reported to improve stratum-corneum water content and support elasticity under certain study conditions. Larger collagen molecules mainly form a surface film that helps skin feel softer, smoother, and less prone to moisture loss.",
          limits: "Applied collagen does not automatically penetrate the dermis or replace the skin's natural collagen. Evidence from oral collagen supplements cannot prove the performance of a cream. Cosmetic results depend on collagen form, molecular size, supporting ingredients, and the complete formulation."
        }
      },
      "Licorice Extract": {
        id: {
          studied: "Licorice Extract mengandung berbagai senyawa, termasuk glabridin dan liquiritin. Penelitian laboratorium dan kajian dermatologi menilai pengaruh senyawa tersebut terhadap enzim tyrosinase, pembentukan melanin, stres oksidatif, dan mediator inflamasi.",
          findings: "Glabridin menunjukkan kemampuan menghambat aktivitas tyrosinase dan pembentukan pigmen pada model laboratorium. Karena itu, Licorice Extract banyak digunakan untuk membantu merawat tampilan noda gelap, kulit kusam, dan warna kulit tidak merata. Sifat antioksidan serta efek menenangkannya juga mendukung penggunaannya pada kosmetik.",
          limits: "Sebagian besar bukti mekanisme berasal dari studi sel atau hewan, sehingga hasilnya tidak dapat disamakan langsung dengan hasil klinis pada manusia. Kadar glabridin dan komposisi ekstrak dapat berbeda antarproduk. Perubahan pigmentasi membutuhkan penggunaan konsisten dan perlindungan matahari."
        },
        en: {
          studied: "Licorice Extract contains several compounds, including glabridin and liquiritin. Laboratory research and dermatology reviews evaluate their effects on tyrosinase activity, melanin formation, oxidative stress, and inflammatory mediators.",
          findings: "Glabridin has demonstrated inhibition of tyrosinase activity and pigment formation in laboratory models. This is why Licorice Extract is widely used to care for the appearance of dark spots, dullness, and uneven tone. Its antioxidant and soothing properties also support cosmetic use.",
          limits: "Much of the mechanistic evidence comes from cell or animal studies and cannot be treated as identical to clinical results in humans. Glabridin levels and extract composition vary by product. Visible pigmentation changes require consistent use and sun protection."
        }
      },
      "Ethyl Ascorbic Acid": {
        id: {
          studied: "3-O-Ethyl Ascorbic Acid merupakan derivatif vitamin C yang dikembangkan agar lebih stabil dalam formulasi dibandingkan ascorbic acid murni. Penelitian menilai aktivitas antioksidan, pengaruh terhadap pembentukan melanin, kemampuan masuk ke kulit, serta penggunaannya dalam formula pencerah.",
          findings: "Studi laboratorium menunjukkan aktivitas anti-melanogenesis dan dukungan antioksidan. Penelitian formulasi kosmetik juga menunjukkan potensinya untuk membantu tampilan kulit kusam, noda gelap, dan tanda photoaging bila digunakan secara rutin dalam produk yang stabil.",
          limits: "Stabilitas derivatif tidak menjamin semua produk tetap aktif setelah dibuka; kemasan, cahaya, suhu, pH, dan bahan lain tetap berpengaruh. Sebagian bukti masih berupa studi laboratorium atau formula kombinasi, sehingga manfaat tidak dapat diatribusikan hanya kepada satu bahan. Iritasi tetap mungkin terjadi."
        },
        en: {
          studied: "3-O-Ethyl Ascorbic Acid is a vitamin C derivative developed for improved formulation stability compared with pure ascorbic acid. Research evaluates antioxidant activity, effects on melanin formation, skin delivery, and its use in brightening formulas.",
          findings: "Laboratory studies show anti-melanogenic activity and antioxidant support. Cosmetic-formulation research also suggests potential benefits for dullness, dark spots, and visible photoaging when used consistently in a stable product.",
          limits: "Derivative stability does not guarantee that every opened product remains fully active; packaging, light, temperature, pH, and other ingredients still matter. Some evidence comes from laboratory studies or combination formulas, so benefits cannot always be attributed to this ingredient alone. Irritation remains possible."
        }
      },
      "DNA Salmon": {
        id: {
          studied: "Istilah DNA Salmon biasanya berkaitan dengan Sodium DNA atau PDRN, yaitu campuran fragmen DNA yang dimurnikan. Literatur farmakologi meneliti PDRN pada proses perbaikan jaringan, respons inflamasi, dan aktivasi jalur adenosine A2A. Penelitian kulit juga mengamati potensi dukungan terhadap barrier dan regenerasi.",
          findings: "Hasil awal menunjukkan PDRN berpotensi mendukung lingkungan biologis yang berkaitan dengan pemulihan jaringan dan fungsi barrier. Dalam kosmetik oles, penjelasan yang paling aman adalah bahwa Sodium DNA digunakan sebagai bahan skin-conditioning untuk membantu kulit terasa lembap, halus, dan terawat.",
          limits: "Sebagian besar bukti PDRN yang kuat berasal dari penggunaan medis, penelitian laboratorium, hewan, atau prosedur injeksi—bukan kosmetik oles biasa. Karena itu, hasil tersebut tidak boleh diterjemahkan sebagai janji bahwa krim dapat menyembuhkan atau meregenerasi kulit. Sumber bahan juga penting bagi pengguna dengan alergi ikan."
        },
        en: {
          studied: "The term Salmon DNA commonly relates to Sodium DNA or PDRN, a mixture of purified DNA fragments. Pharmacology literature investigates PDRN in tissue-repair processes, inflammatory responses, and adenosine A2A pathway activation. Skin research also examines potential support for barrier function and regeneration.",
          findings: "Early findings suggest that PDRN may support a biological environment associated with tissue recovery and barrier function. For topical cosmetics, the safest interpretation is that Sodium DNA acts as a skin-conditioning ingredient that helps skin feel moisturized, smooth, and cared for.",
          limits: "Much of the stronger PDRN evidence comes from medical use, laboratory or animal research, or injectable procedures—not ordinary topical cosmetics. These results must not be translated into a promise that a cream heals or regenerates skin. Ingredient sourcing also matters for users with fish allergy."
        }
      },
      "Titanium Dioxide": {
        id: {
          studied: "Titanium Dioxide telah lama diteliti sebagai pigmen mineral dan UV filter anorganik. Kajian sunscreen membahas spektrum perlindungan, ukuran partikel, kemampuan menyerap serta menyebarkan radiasi UV, penetrasi kulit, toleransi, dan keamanan bentuk nano maupun non-nano.",
          findings: "Literatur menunjukkan Titanium Dioxide memberikan perlindungan kuat terutama terhadap UVB dan sebagian UVA, serta umumnya memiliki risiko rendah ketika digunakan pada kulit dalam formulasi sunscreen yang sesuai. Sebagai pigmen, bahan ini juga memberi warna putih, daya tutup, dan membantu konsistensi visual produk.",
          limits: "Adanya Titanium Dioxide pada daftar bahan tidak otomatis membuktikan sebuah produk memiliki perlindungan matahari. Nilai SPF dan PA harus berasal dari pengujian produk akhir. Penilaian keamanan untuk penggunaan pada kulit tidak sama dengan paparan lewat pernapasan; bentuk bubuk atau aerosol yang dapat terhirup memerlukan perhatian khusus."
        },
        en: {
          studied: "Titanium Dioxide has long been studied as a mineral pigment and inorganic UV filter. Sunscreen reviews examine protection spectrum, particle size, UV absorption and scattering, skin penetration, tolerability, and the safety of nano and non-nano forms.",
          findings: "The literature shows that Titanium Dioxide provides strong protection particularly in the UVB range and part of UVA, with generally low risk when used on skin in an appropriate sunscreen formulation. As a pigment, it also provides whiteness, coverage, and visual consistency.",
          limits: "The presence of Titanium Dioxide in an ingredient list does not prove that a product provides sun protection. SPF and PA values must come from testing the finished product. Safety assessment for skin application is not equivalent to inhalation exposure; inhalable powder or aerosol forms require special caution."
        }
      }
    };


    /* ==========================================
       TRANSLATION
    ========================================== */

    const translation = {

      id: {
        navHome: "Beranda",
        navAbout: "Tentang",
        navProducts: "Produk",
        navIngredients: "Ingredients",
        navVideo: "Video",
        navReviews: "Review",
        navCollaboration: "Kolaborasi",

        heroTag: "✦ Everyday Skin Ritual",

        heroTitle:
          '<span class="hero-title-lead">Rawat kulitmu.</span><span class="hero-title-main">Temukan glow-mu.</span>',

        heroDesc:
          "Mejavi Skin menghadirkan rangkaian skincare dan body care yang dirancang untuk membantu merawat kulit agar tampak sehat, lembap, cerah dan terawat setiap hari.",

        shopNow: "Belanja Sekarang",
        watchVideo: "▶ Lihat Video",

        trust1: "Pilihan skincare harian",
        trust2: "Checkout mudah",
        trust3: "Made with care",

        heroCard: "Your daily skin ritual",

        heroCardSub:
          "Skincare • Body Care • Self Care",

        aboutTag:
          "Tentang Mejavi Skin",

        aboutTitle:
          "Perawatan kulit yang menjadi bagian dari ritual harianmu.",

        aboutDesc1:
          "Mejavi Skin+ adalah brand perawatan kulit wajah dan tubuh yang menghadirkan rangkaian skincare, body care, dan self-care untuk membantu menjaga kulit terasa lembap, nyaman, serta tampak cerah dan terawat.",

        aboutDesc2:
          "Rangkaiannya mencakup cleanser, serum wajah, cream, moisturizer, body serum, dan herbal relaxing cream. Setiap produk dibuat agar mudah digunakan serta melengkapi langkah perawatan dari pagi hingga malam.",

        aboutQuote:
          "Kami percaya perawatan kulit bukan sekadar mengejar hasil instan, tetapi membangun kebiasaan sederhana yang dilakukan secara konsisten.",

        aboutFocus1Title:
          "Skin Care",

        aboutFocus1Desc:
          "Perawatan wajah untuk melengkapi rutinitas membersihkan, melembapkan, dan merawat tampilan kulit.",

        aboutFocus2Title:
          "Body Care",

        aboutFocus2Desc:
          "Perawatan tubuh untuk membantu kulit tetap terasa lembut, nyaman, dan tampak terawat.",

        aboutFocus3Title:
          "Self Care",

        aboutFocus3Desc:
          "Momen perawatan yang membuat rutinitas harian terasa lebih personal dan menyenangkan.",

        visionMissionTag:
          "Arah Brand",

        visionMissionTitle:
          "Visi dan misi yang mengarahkan setiap langkah Mejavi Skin.",

        visionMissionIntro:
          "Mejavi Skin ingin bertumbuh sebagai brand yang dekat dengan kebutuhan nyata konsumennya. Visi dan misi ini menjadi arah dalam mengembangkan produk, menyampaikan edukasi, membangun pelayanan, dan menjalin hubungan jangka panjang.",

        visionLabel:
          "Visi Kami",

        visionDesc:
          "Menjadi brand skincare dan body care yang dipercaya sebagai bagian dari ritual perawatan harian, dengan menghadirkan produk yang relevan, mudah digunakan, serta membantu setiap orang merawat kulitnya secara nyaman dan konsisten. Mejavi Skin ingin membangun makna bahwa merawat diri adalah bentuk perhatian yang layak dilakukan setiap hari.",

        missionLabel:
          "Misi Kami",

        missionIntro:
          "Lima komitmen berikut menjadi landasan Mejavi Skin dalam melayani pelanggan, mengembangkan rangkaian produk, dan membangun pertumbuhan brand yang berkelanjutan.",

        mission1Title:
          "Produk yang Relevan",

        mission1Desc:
          "Mengembangkan pilihan perawatan wajah dan tubuh yang praktis serta sesuai untuk melengkapi kebutuhan rutinitas sehari-hari.",

        mission2Title:
          "Informasi yang Jelas",

        mission2Desc:
          "Menyampaikan informasi ingredients, manfaat, pilihan ukuran, dan cara penggunaan secara mudah dipahami agar pelanggan dapat memilih dengan lebih yakin.",

        mission3Title:
          "Pengalaman yang Konsisten",

        mission3Desc:
          "Memberikan perhatian pada formula, tekstur, kemasan, komunikasi, dan layanan agar pengalaman bersama Mejavi Skin terasa nyaman dari awal hingga setelah pembelian.",

        mission4Title:
          "Hubungan dengan Pelanggan",

        mission4Desc:
          "Mendengarkan kebutuhan, masukan, dan pengalaman pelanggan sebagai bahan untuk terus belajar, memperbaiki layanan, dan mengembangkan brand.",

        mission5Title:
          "Tumbuh melalui Kolaborasi",

        mission5Desc:
          "Membuka ruang kerja sama dengan kreator, reseller, distributor, komunitas, dan mitra bisnis untuk menciptakan manfaat serta peluang pertumbuhan bersama.",

        benefit1Title: "Daily Skincare",

        benefit1Desc:
          "Mejavi Skin adalah brand perawatan kulit harian yang diformulasikan dengan bahan aktif pilihan dan teruji klinis.\n\nMisi kami sederhana: membuat rutinitas skincare jadi mudah, efektif, dan menyenangkan.\n\nSemua produk Mejavi Skin telah melalui pengujian dermatologi, terdaftar BPOM, dan diformulasikan khusus untuk iklim tropis.\n\nMulai rutinitasmu hari ini untuk hasil yang terlihat nyata.",

        benefit2Title: "Skin Comfort",

        benefit2Desc:
          "Kami meyakini bahwa kulit sehat dimulai dari rasa nyaman.\n\nKami menciptakan produk skincare dengan formula lembut, tanpa alkohol dan pewangi berlebih, khusus untuk menenangkan serta menguatkan skin barrier kamu.\n\nNo more burning, no more tightness. Just pure comfort, every day.",

        benefit3Title: "Selected Ingredients",

        benefit3Desc:
          "Di balik setiap kemasan Mejavi Skin, terdapat bahan-bahan pilihan yang sudah teruji.\n\nKami memilih setiap ingredient bukan karena tren, tetapi karena manfaatnya nyata untuk kulit Indonesia.\n\nNo filler. Just what your skin needs.",

        benefit4Title: "Self Care",

        benefit4Desc:
          "Self care adalah komitmen terhadap kesehatan jangka panjang.\n\nDi Mejavi Skin, kami percaya bahwa perawatan diri dimulai dari rutinitas yang konsisten, efektif, dan berbasis riset.\n\nSetiap produk diformulasikan dengan selected ingredients yang teruji secara dermatologi untuk mendukung fungsi skin barrier dan kesehatan kulit secara menyeluruh.\n\nKarena kulit yang sehat adalah fondasi dari rasa percaya diri.",

        bpomKicker:
          "Keamanan Produk",

        bpomTitle:
          "Terdaftar BPOM",

        bpomDesc:
          "Nomor notifikasi BPOM setiap produk dapat diperiksa pada kemasan dan melalui situs resmi Cek BPOM.",

        bpomCheck:
          "Cek registrasi resmi ↗",

        collagenDocumentLabel:
          "Dokumen edukasi · 13 halaman",

        collagenKicker:
          "Referensi Ilmiah",

        collagenTitle:
          "Keunggulan Kolagen Sapi untuk Kosmetik",

        collagenDesc:
          "Pelajari peran kolagen pada struktur kulit, perbandingan kolagen sapi dan kolagen ikan, keunggulannya dalam formulasi kosmetik, serta produk Mejavi Skin+ yang menggunakan kolagen sapi.",

        collagenPoint1:
          "Kolagen tipe I & III",

        collagenPoint2:
          "Stabilitas termal tinggi",

        collagenPoint3:
          "Profil aroma netral",

        collagenRead:
          "Baca PDF lengkap ↗",

        collagenDownload:
          "Unduh PDF",

        productTag: "Produk Kami",

        productTitle:
          "Temukan produk Mejavi Skin untuk rutinitasmu.",

        productSubtitle:
          "Klik detail untuk melihat komposisi, manfaat, cara penggunaan dan pilihan ukuran.",

        productionTag:
          "Proses Produksi",

        productionTitle:
          "Dari formulasi hingga pengemasan, setiap tahap dilakukan dengan penuh perhatian.",

        productionDesc:
          "Produk Mejavi Skin melalui tahapan produksi yang terencana, mulai dari persiapan formula dan bahan, proses pencampuran, pemeriksaan hasil, hingga pengisian dan pengemasan. Alur ini membantu menjaga konsistensi produk sebelum siap digunakan.",

        productionStep1Title:
          "Perencanaan Formula",

        productionStep1Desc:
          "Kebutuhan dan fungsi produk ditentukan terlebih dahulu agar kombinasi bahan sesuai dengan tujuan perawatannya.",

        productionStep2Title:
          "Persiapan Bahan",

        productionStep2Desc:
          "Bahan disiapkan dan ditakar mengikuti komposisi formula sebelum memasuki proses pembuatan produk.",

        productionStep3Title:
          "Pencampuran Produk",

        productionStep3Desc:
          "Bahan diproses dan dicampurkan secara bertahap untuk menghasilkan tekstur serta karakter produk yang konsisten.",

        productionStep4Title:
          "Pemeriksaan & Pengemasan",

        productionStep4Desc:
          "Hasil produksi diperiksa, lalu diisi ke dalam kemasan, diberi identitas produk, dan dipersiapkan untuk distribusi.",

        videoTag: "Mejavi Experience",

        videoTitle:
          "Skincare bukan sekadar rutinitas.",

        videoDesc:
          "Jadikan setiap langkah perawatan sebagai waktu untuk memberikan perhatian lebih pada dirimu dan kulitmu. Temukan rangkaian Mejavi Skin yang sesuai dengan kebutuhan harianmu.",

        exploreProduct: "Lihat Produk",
        
        ingredientTag:
          "Bahan Utama",

        ingredientTitle:
          "Ingredients yang mendukung rutinitas perawatan kulitmu.",

        ingredientDesc:
          "Kenali bahan aktif pilihan dalam rangkaian Mejavi Skin beserta perannya untuk membantu merawat kulit setiap hari.",
            
    
        reviewTag:
          "Customer Review",

        reviewTitle:
          "Cerita dari pengguna Mejavi.",

        review1:
          "Teksturnya nyaman untuk dipakai sehari-hari dan packaging-nya juga terlihat premium.",

        review2:
          "Body serum mudah digunakan dan membuat rutinitas body care jadi lebih menyenangkan.",

        review3:
          "Suka dengan desain produknya yang clean dan rangkaiannya cukup lengkap.",

        collaborationTag:
          "Open Collaboration",

        collaborationTitle:
          "Mari bertumbuh bersama melalui kolaborasi yang saling menguatkan.",

        collaborationDesc1:
          "Mejavi Skin membuka kesempatan kolaborasi bagi individu, komunitas, kreator, reseller, distributor, pemilik toko, dan mitra bisnis yang memiliki semangat untuk menghadirkan pengalaman perawatan kulit yang lebih dekat kepada pelanggan.",

        collaborationDesc2:
          "Kami terbuka untuk mendiskusikan ide kampanye, pembuatan konten, program afiliasi, pemasaran produk, perluasan jaringan penjualan, kegiatan komunitas, hingga proyek khusus yang dapat memberikan nilai nyata bagi kedua pihak.",

        collaboration1Title:
          "Reseller & Distributor",

        collaboration1Desc:
          "Terbuka bagi mitra yang ingin membangun jaringan penjualan, memperluas jangkauan produk, dan memperkenalkan Mejavi Skin kepada pelanggan di wilayah atau komunitasnya.",

        collaboration2Title:
          "Creator & Affiliate",

        collaboration2Desc:
          "Kesempatan bagi content creator dan affiliate untuk membuat konten informatif, review, tutorial, serta kampanye kreatif yang relevan dengan karakter audiensnya.",

        collaboration3Title:
          "Retail & Beauty Partner",

        collaboration3Desc:
          "Kolaborasi bersama toko, salon, studio kecantikan, dan pelaku usaha terkait untuk menghadirkan produk melalui pengalaman belanja serta pelayanan yang lebih personal.",

        collaboration4Title:
          "Community & Event",

        collaboration4Desc:
          "Ruang kerja sama untuk kegiatan komunitas, edukasi, workshop, event, gifting, dan aktivasi brand yang sejalan dengan nilai perawatan diri serta kebersamaan.",

        collaborationProcessTitle:
          "Bagaimana memulai kolaborasi?",

        collaborationProcessDesc:
          "Ceritakan siapa Anda, bentuk kerja sama yang diinginkan, sasaran audiens atau wilayah, serta ide awal yang ingin dikembangkan. Tim Mejavi Skin dapat mempelajari kebutuhan tersebut sebelum melanjutkan ke pembahasan yang lebih terarah.",

        collaborationProcess1Title:
          "01 • Kirim Profil & Ide",

        collaborationProcess1Desc:
          "Sertakan profil singkat, kanal atau area pemasaran, serta bentuk kolaborasi yang Anda tawarkan.",

        collaborationProcess2Title:
          "02 • Diskusi Kebutuhan",

        collaborationProcess2Desc:
          "Tujuan, konsep, pembagian peran, kebutuhan produk, dan rencana pelaksanaan dibahas bersama.",

        collaborationProcess3Title:
          "03 • Jalankan Kolaborasi",

        collaborationProcess3Desc:
          "Setelah detail disepakati, kolaborasi dijalankan dan dievaluasi untuk membangun hubungan jangka panjang.",

        collaborationWhatsApp:
          "Ajukan via WhatsApp",

        collaborationEmail:
          "Kirim Proposal via Email",

        faqTitle:
          "Pertanyaan yang sering ditanyakan.",

        faqQ1:
          "Bagaimana cara membeli produk Mejavi Skin?",

        faqA1:
          "Pilih produk, buka detail produk lalu tekan tombol Beli melalui Lynk.id. Anda akan diarahkan ke halaman pembayaran produk.",

        faqQ2:
          "Apakah Body Serum tersedia dalam beberapa ukuran?",

        faqA2:
          "Ya. Body Serum tersedia dalam ukuran 60gr, 100gr dan 250gr.",

        faqQ3:
          "Bagaimana mengetahui ingredients setiap produk?",

        faqA3:
          "Tekan tombol Detail pada produk untuk melihat ingredients, manfaat serta cara penggunaan.",

        faqQ4:
          "Apakah website tersedia dalam Bahasa Inggris?",

        faqA4:
          "Ya. Tekan tombol ID / EN di bagian atas website untuk mengganti bahasa.",

        faqQ5:
          "Bagaimana cara mengajukan kolaborasi dengan Mejavi Skin?",

        faqA5:
          "Buka bagian Open Collaboration, pilih tombol WhatsApp atau email, lalu kirimkan profil singkat, bentuk kerja sama yang diinginkan, target audiens atau wilayah, dan ide awal Anda.",

        newsletterTitle:
          "Stay close with Mejavi.",

        newsletterDesc:
          "Dapatkan informasi produk dan kabar terbaru dari Mejavi Skin.",

        subscribeBtn:
          "Subscribe",

        footerDesc:
          "Mejavi Skin menghadirkan rangkaian skincare dan body care untuk melengkapi rutinitas perawatan kulit sehari-hari.",

        footerMenu:
          "Menu",

        footerFollow:
          "Ikuti Kami",

        modalBenefit:
          "Manfaat",

        modalIngredients:
          "Ingredients",

        modalHow:
          "Cara Pakai",

        productBpomRegistered:
          "Terdaftar BPOM",

        modalBpomTitle:
          "Registrasi BPOM",

        modalBpomNumber:
          "Nomor Notifikasi",

        modalBpomRegisteredName:
          "Nama Terdaftar",

        modalBpomValidity:
          "Masa Berlaku",

        modalBpomPackaging:
          "Kemasan pada Dokumen",

        modalBpomManufacturer:
          "Industri Kosmetika",

        modalBpomVerify:
          "Cek di situs BPOM ↗",

        modalBpomDocument:
          "Lihat dokumen & QR",

        modalBpomPreview:
          "Ketuk untuk membuka dokumen lengkap",

        modalBpomNote:
          "Informasi ditampilkan sesuai dokumen BPOM yang diberikan. Cocokkan nomor notifikasi dan kemasan sebelum membeli.",

        whatsappChat:
          "Chat WhatsApp",

        buyLynk:
          "Beli melalui Lynk.id"
      },


      en: {
        navHome: "Home",
        navAbout: "About",
        navProducts: "Products",
        navIngredients: "Ingredients",
        navVideo: "Video",
        navReviews: "Reviews",
        navCollaboration: "Collaboration",

        heroTag:
          "✦ Everyday Skin Ritual",

        heroTitle:
          '<span class="hero-title-lead">Care for your skin.</span><span class="hero-title-main">Find your glow.</span>',

        heroDesc:
          "Mejavi Skin brings together skincare and body care products designed to support healthy-looking, moisturized and well-cared-for skin every day.",

        shopNow:
          "Shop Now",

        watchVideo:
          "▶ Watch Video",

        trust1:
          "Daily skincare selection",

        trust2:
          "Easy checkout",

        trust3:
          "Made with care",

        heroCard:
          "Your daily skin ritual",

        heroCardSub:
          "Skincare • Body Care • Self Care",

        aboutTag:
          "About Mejavi Skin",

        aboutTitle:
          "Skincare that becomes part of your everyday ritual.",

        aboutDesc1:
          "Mejavi Skin+ is a face and body care brand offering skincare, body care, and self-care products designed to help the skin feel moisturized and comfortable while looking bright and well cared for.",

        aboutDesc2:
          "The range includes cleanser, facial serum, cream, moisturizer, body serum, and herbal relaxing cream. Each product is made to be easy to use and to complement your skincare steps from morning to evening.",

        aboutQuote:
          "We believe skincare is not simply about chasing instant results, but about building simple habits and following them consistently.",

        aboutFocus1Title:
          "Skin Care",

        aboutFocus1Desc:
          "Facial care that complements cleansing, moisturizing, and caring for the appearance of your skin.",

        aboutFocus2Title:
          "Body Care",

        aboutFocus2Desc:
          "Body care that helps the skin feel soft and comfortable while supporting a well-cared-for appearance.",

        aboutFocus3Title:
          "Self Care",

        aboutFocus3Desc:
          "Care moments that make an everyday routine feel more personal and enjoyable.",

        visionMissionTag:
          "Our Direction",

        visionMissionTitle:
          "The vision and mission guiding every step of Mejavi Skin.",

        visionMissionIntro:
          "Mejavi Skin aims to grow as a brand that stays close to the real needs of its customers. This vision and mission guide how we develop products, share education, build service, and nurture long-term relationships.",

        visionLabel:
          "Our Vision",

        visionDesc:
          "To become a trusted skincare and body care brand that forms part of an everyday care ritual by offering relevant, easy-to-use products that help people care for their skin comfortably and consistently. Mejavi Skin seeks to reinforce the idea that self-care is a meaningful form of attention everyone deserves each day.",

        missionLabel:
          "Our Mission",

        missionIntro:
          "The following five commitments provide the foundation for Mejavi Skin as we serve customers, develop our product range, and pursue sustainable brand growth.",

        mission1Title:
          "Relevant Products",

        mission1Desc:
          "Develop practical face and body care options designed to complement the needs of an everyday routine.",

        mission2Title:
          "Clear Information",

        mission2Desc:
          "Present ingredients, benefits, size options, and usage instructions clearly so customers can make more confident choices.",

        mission3Title:
          "A Consistent Experience",

        mission3Desc:
          "Give attention to formulas, textures, packaging, communication, and service so the Mejavi Skin experience feels comfortable from discovery through post-purchase care.",

        mission4Title:
          "Customer Relationships",

        mission4Desc:
          "Listen to customer needs, feedback, and experiences as valuable input for continuous learning, service improvement, and brand development.",

        mission5Title:
          "Growth through Collaboration",

        mission5Desc:
          "Create opportunities with creators, resellers, distributors, communities, and business partners to generate shared value and sustainable growth.",

        benefit1Title:
          "Daily Skincare",

        benefit1Desc:
          "Mejavi Skin is a daily skincare brand formulated with carefully selected, clinically tested active ingredients.\n\nOur mission is simple: to make skincare routines easy, effective, and enjoyable.\n\nMejavi Skin products are dermatologically tested, registered with Indonesia's BPOM, and specially formulated for tropical climates.\n\nStart your routine today for results you can see.",

        benefit2Title:
          "Skin Comfort",

        benefit2Desc:
          "We believe healthy skin begins with comfort.\n\nWe create skincare with gentle formulas, free from alcohol and excessive fragrance, specifically designed to soothe and strengthen your skin barrier.\n\nNo more burning, no more tightness. Just pure comfort, every day.",

        benefit3Title:
          "Selected Ingredients",

        benefit3Desc:
          "Behind every Mejavi Skin package are carefully selected ingredients that have been tested.\n\nWe choose every ingredient not because it is trending, but because it offers meaningful benefits for Indonesian skin.\n\nNo filler. Just what your skin needs.",

        benefit4Title:
          "Self Care",

        benefit4Desc:
          "Self care is a commitment to long-term well-being.\n\nAt Mejavi Skin, we believe self-care begins with a routine that is consistent, effective, and research-based.\n\nEvery product is formulated with dermatologically tested selected ingredients to support skin-barrier function and overall skin health.\n\nBecause healthy skin is the foundation of self-confidence.",

        bpomKicker:
          "Product Safety",

        bpomTitle:
          "BPOM Registered",

        bpomDesc:
          "The BPOM notification number for each product can be checked on its packaging and through the official Cek BPOM website.",

        bpomCheck:
          "Check official registration ↗",

        collagenDocumentLabel:
          "Educational document · 13 pages",

        collagenKicker:
          "Scientific Reference",

        collagenTitle:
          "The Advantages of Bovine Collagen in Cosmetics",

        collagenDesc:
          "Explore collagen's role in skin structure, a comparison of bovine and marine collagen, its advantages in cosmetic formulation, and the Mejavi Skin+ products formulated with bovine collagen.",

        collagenPoint1:
          "Type I & III collagen",

        collagenPoint2:
          "High thermal stability",

        collagenPoint3:
          "Neutral aroma profile",

        collagenRead:
          "Read the full PDF ↗",

        collagenDownload:
          "Download PDF",

        productTag:
          "Our Products",

        productTitle:
          "Discover Mejavi Skin products for your routine.",

        productSubtitle:
          "Open product details to discover ingredients, benefits, usage instructions and available sizes.",

        productionTag:
          "Production Process",

        productionTitle:
          "From formulation to packaging, every stage is handled with care.",

        productionDesc:
          "Mejavi Skin products go through a planned production flow, from preparing the formula and ingredients to mixing, result inspection, filling, and packaging. This process helps maintain product consistency before it is ready to use.",

        productionStep1Title:
          "Formula Planning",

        productionStep1Desc:
          "The product's purpose and intended function are defined first so the ingredient combination supports its care objective.",

        productionStep2Title:
          "Ingredient Preparation",

        productionStep2Desc:
          "Ingredients are prepared and measured according to the formula before entering the product-making process.",

        productionStep3Title:
          "Product Mixing",

        productionStep3Desc:
          "Ingredients are processed and combined in stages to create a consistent texture and product character.",

        productionStep4Title:
          "Inspection & Packaging",

        productionStep4Desc:
          "The finished product is inspected, filled into its packaging, labeled, and prepared for distribution.",

        videoTag:
          "Mejavi Experience",

        videoTitle:
          "Skincare is more than a routine.",

        videoDesc:
          "Turn every skincare step into a moment to care for yourself and your skin. Discover Mejavi Skin products for your everyday needs.",

        exploreProduct:
          "Explore Products",

        ingredientTag:
          "Key Ingredients",

        ingredientTitle:
          "Ingredients that support your skincare routine.",

        ingredientDesc:
          "Discover selected active ingredients featured across Mejavi Skin products and their roles in supporting an everyday skincare routine.",

        reviewTag:
          "Customer Reviews",

        reviewTitle:
          "Stories from Mejavi users.",

        review1:
          "The texture feels comfortable for everyday use and the packaging looks premium.",

        review2:
          "The body serum is easy to use and makes my body care routine more enjoyable.",

        review3:
          "I love the clean product design and the complete skincare selection.",

        collaborationTag:
          "Open Collaboration",

        collaborationTitle:
          "Let us grow together through collaboration that strengthens both sides.",

        collaborationDesc1:
          "Mejavi Skin welcomes collaboration with individuals, communities, creators, resellers, distributors, store owners, and business partners who share an interest in bringing skincare experiences closer to customers.",

        collaborationDesc2:
          "We are open to discussing campaign ideas, content creation, affiliate programs, product marketing, sales network expansion, community activities, and special projects capable of creating meaningful value for both parties.",

        collaboration1Title:
          "Reseller & Distributor",

        collaboration1Desc:
          "For partners interested in building a sales network, expanding product reach, and introducing Mejavi Skin to customers in their area or community.",

        collaboration2Title:
          "Creator & Affiliate",

        collaboration2Desc:
          "An opportunity for content creators and affiliates to develop informative content, reviews, tutorials, and creative campaigns suited to their audience.",

        collaboration3Title:
          "Retail & Beauty Partner",

        collaboration3Desc:
          "Collaboration with stores, salons, beauty studios, and related businesses to offer products through a more personal shopping and service experience.",

        collaboration4Title:
          "Community & Event",

        collaboration4Desc:
          "Partnership opportunities for community activities, education, workshops, events, gifting, and brand activations aligned with self-care and togetherness.",

        collaborationProcessTitle:
          "How do we start a collaboration?",

        collaborationProcessDesc:
          "Tell us who you are, the type of partnership you are interested in, your target audience or territory, and the initial idea you would like to develop. The Mejavi Skin team can review these needs before moving into a more focused discussion.",

        collaborationProcess1Title:
          "01 • Share Your Profile & Idea",

        collaborationProcess1Desc:
          "Include a short profile, your channel or marketing territory, and the type of collaboration you are proposing.",

        collaborationProcess2Title:
          "02 • Discuss the Needs",

        collaborationProcess2Desc:
          "Together, we discuss the goals, concept, roles, product requirements, and proposed implementation plan.",

        collaborationProcess3Title:
          "03 • Launch the Collaboration",

        collaborationProcess3Desc:
          "Once the details are agreed, the collaboration is launched and evaluated with a view to building a long-term relationship.",

        collaborationWhatsApp:
          "Apply via WhatsApp",

        collaborationEmail:
          "Send a Proposal by Email",

        faqTitle:
          "Frequently asked questions.",

        faqQ1:
          "How can I purchase Mejavi Skin products?",

        faqA1:
          "Select a product, open its details and tap the Buy through Lynk.id button. You will be redirected to its payment page.",

        faqQ2:
          "Is Body Serum available in multiple sizes?",

        faqA2:
          "Yes. Body Serum is available in 60gr, 100gr and 250gr sizes.",

        faqQ3:
          "Where can I see each product's ingredients?",

        faqA3:
          "Tap the Details button to view the product ingredients, benefits and usage instructions.",

        faqQ4:
          "Is this website available in Indonesian?",

        faqA4:
          "Yes. Tap the ID / EN button at the top of the website to switch languages.",

        faqQ5:
          "How can I propose a collaboration with Mejavi Skin?",

        faqA5:
          "Open the Open Collaboration section, choose WhatsApp or email, and send a short profile, your preferred partnership type, target audience or territory, and initial idea.",

        newsletterTitle:
          "Stay close with Mejavi.",

        newsletterDesc:
          "Get the latest product information and news from Mejavi Skin.",

        subscribeBtn:
          "Subscribe",

        footerDesc:
          "Mejavi Skin offers skincare and body care products created to complement your everyday self-care routine.",

        footerMenu:
          "Menu",

        footerFollow:
          "Follow Us",

        modalBenefit:
          "Benefits",

        modalIngredients:
          "Ingredients",

        modalHow:
          "How to Use",

        productBpomRegistered:
          "BPOM Registered",

        modalBpomTitle:
          "BPOM Registration",

        modalBpomNumber:
          "Notification Number",

        modalBpomRegisteredName:
          "Registered Name",

        modalBpomValidity:
          "Validity Period",

        modalBpomPackaging:
          "Packaging on Document",

        modalBpomManufacturer:
          "Cosmetics Manufacturer",

        modalBpomVerify:
          "Check on BPOM website ↗",

        modalBpomDocument:
          "View document & QR",

        modalBpomPreview:
          "Tap to open the complete document",

        modalBpomNote:
          "Information is shown according to the supplied BPOM document. Match the notification number and packaging before purchase.",

        whatsappChat:
          "Chat on WhatsApp",

        buyLynk:
          "Buy through Lynk.id"
      }

    };


    /* ==========================================
       BACKEND CONTENT BRIDGE
    ========================================== */

    function cloneContent(value) {
      return JSON.parse(JSON.stringify(value));
    }


    function mergeContent(target, incoming) {
      if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
        return target;
      }

      Object.entries(incoming).forEach(([key, value]) => {
        if (
          value &&
          typeof value === "object" &&
          !Array.isArray(value) &&
          target[key] &&
          typeof target[key] === "object" &&
          !Array.isArray(target[key])
        ) {
          mergeContent(target[key], value);
        } else {
          target[key] = cloneContent(value);
        }
      });

      return target;
    }


    function replaceContentArray(target, incoming) {
      if (!Array.isArray(incoming) || incoming.length === 0) return;
      target.splice(0, target.length, ...cloneContent(incoming));
    }


    function applyBackendContent(content) {
      if (!content || typeof content !== "object") return;

      replaceContentArray(products, content.products);
      replaceContentArray(keyIngredients, content.keyIngredients);

      if (content.ingredientResearch) {
        Object.keys(ingredientResearch).forEach(key => delete ingredientResearch[key]);
        mergeContent(ingredientResearch, content.ingredientResearch);
      }

      if (content.translations?.id) {
        mergeContent(translation.id, content.translations.id);
      }

      if (content.translations?.en) {
        mergeContent(translation.en, content.translations.en);
      }

      window.mejaviApplySiteSettings?.(content.settings);
    }


    function refreshBackendContent() {
      setLanguage(currentLanguage);
      window.mejaviStore?.syncCatalog?.();
      window.setTimeout(initReveal, 50);
    }


    window.mejaviCMS = {
      products,
      keyIngredients,
      ingredientResearch,
      translation,
      applyContent: applyBackendContent,
      refresh: refreshBackendContent,
      snapshot() {
        return cloneContent({
          products,
          keyIngredients,
          ingredientResearch,
          translations: translation,
          settings: window.mejaviSiteSettings || {}
        });
      }
    };


    /* ==========================================
       FORMAT CURRENCY
    ========================================== */

    function rupiah(number) {
      return new Intl.NumberFormat(
        "id-ID",
        {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0
        }
      ).format(number);
    }


    /* ==========================================
       INGREDIENT RENDER
    ========================================== */

    function renderIngredients() {

      const grid =
        document.getElementById("ingredientGrid");

      if (!grid) {
        return;
      }

      grid.replaceChildren();

      keyIngredients.forEach((ingredient, index) => {

        const card =
          document.createElement("article");

        card.className =
          "ingredient-card reveal";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute(
          "aria-label",
          `${currentLanguage === "id" ? "Lihat manfaat" : "View benefits"}: ${ingredient.name}`
        );


        const icon =
          document.createElement("span");

        icon.textContent = ingredient.icon;
        icon.setAttribute("aria-hidden", "true");


        const title =
          document.createElement("h3");

        title.textContent = ingredient.name;


        const description =
          document.createElement("p");

        description.textContent =
          ingredient.description[currentLanguage];

        const hint = document.createElement("span");
        hint.className = "ingredient-card-hint";
        hint.textContent = currentLanguage === "id"
          ? "Lihat manfaat lengkap →"
          : "View full benefits →";


        card.append(
          icon,
          title,
          description,
          hint
        );

        card.addEventListener("click", () => openIngredient(index));
        card.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openIngredient(index);
          }
        });

        grid.appendChild(card);

      });
    }


    function getIngredientModal() {
      let ingredientModal = document.getElementById("ingredientModal");

      if (ingredientModal) return ingredientModal;

      ingredientModal = document.createElement("div");
      ingredientModal.id = "ingredientModal";
      ingredientModal.className = "ingredient-modal";
      ingredientModal.setAttribute("role", "dialog");
      ingredientModal.setAttribute("aria-modal", "true");
      ingredientModal.setAttribute("aria-labelledby", "ingredientModalTitle");
      ingredientModal.innerHTML = `
        <div class="ingredient-dialog">
          <button class="ingredient-modal-close" type="button" aria-label="Tutup">×</button>
          <div class="ingredient-modal-icon" aria-hidden="true"></div>
          <p class="ingredient-modal-eyebrow"></p>
          <h2 id="ingredientModalTitle"></h2>
          <p class="ingredient-modal-intro"></p>
          <section class="ingredient-modal-section">
            <h3 class="ingredient-benefit-title"></h3>
            <ul class="ingredient-benefit-list"></ul>
          </section>
          <div class="ingredient-info-grid">
            <section>
              <h3 class="ingredient-suitable-title"></h3>
              <p class="ingredient-suitable"></p>
            </section>
            <section>
              <h3 class="ingredient-note-title"></h3>
              <p class="ingredient-note"></p>
            </section>
          </div>
          <section class="ingredient-sources">
            <h3 class="ingredient-sources-title"></h3>
            <p class="ingredient-sources-intro"></p>
            <div class="ingredient-research-grid">
              <article>
                <span class="research-number">01</span>
                <h4 class="research-studied-title"></h4>
                <p class="research-studied"></p>
              </article>
              <article>
                <span class="research-number">02</span>
                <h4 class="research-findings-title"></h4>
                <p class="research-findings"></p>
              </article>
              <article>
                <span class="research-number">03</span>
                <h4 class="research-limits-title"></h4>
                <p class="research-limits"></p>
              </article>
            </div>
            <h4 class="ingredient-links-title"></h4>
            <div class="ingredient-source-links"></div>
          </section>
          <p class="ingredient-disclaimer"></p>
        </div>`;

      document.body.appendChild(ingredientModal);
      ingredientModal.querySelector(".ingredient-modal-close")
        .addEventListener("click", closeIngredient);
      ingredientModal.addEventListener("click", event => {
        if (event.target === ingredientModal) closeIngredient();
      });

      return ingredientModal;
    }


    function updateIngredientModal() {
      if (selectedIngredient === null) return;

      const ingredient = keyIngredients[selectedIngredient];
      const content = ingredient.details[currentLanguage];
      const research = ingredientResearch[ingredient.name][currentLanguage];
      const ingredientModal = getIngredientModal();
      const setText = (selector, value) => {
        ingredientModal.querySelector(selector).textContent = value;
      };

      setText(".ingredient-modal-icon", ingredient.icon);
      setText(".ingredient-modal-eyebrow", currentLanguage === "id" ? "Kenali ingredient" : "Know the ingredient");
      setText("#ingredientModalTitle", ingredient.name);
      setText(".ingredient-modal-intro", content.intro);
      setText(".ingredient-benefit-title", currentLanguage === "id" ? "Manfaat untuk kulit" : "Skin benefits");
      setText(".ingredient-suitable-title", currentLanguage === "id" ? "Cocok untuk" : "Suitable for");
      setText(".ingredient-suitable", content.suitable);
      setText(".ingredient-note-title", currentLanguage === "id" ? "Catatan pemakaian" : "Usage note");
      setText(".ingredient-note", content.note);
      setText(".ingredient-sources-title", currentLanguage === "id" ? "Referensi ilmiah" : "Scientific references");
      setText(".ingredient-sources-intro", currentLanguage === "id"
        ? "Ringkasan berikut membantu membaca bukti secara lebih utuh—mulai dari fokus penelitian, hasil yang ditemukan, hingga hal-hal yang belum dapat disimpulkan."
        : "The summary below provides a fuller reading of the evidence—from what researchers studied and what they found to what cannot yet be concluded.");
      setText(".research-studied-title", currentLanguage === "id" ? "Apa yang diteliti" : "What was studied");
      setText(".research-studied", research.studied);
      setText(".research-findings-title", currentLanguage === "id" ? "Temuan utama" : "Main findings");
      setText(".research-findings", research.findings);
      setText(".research-limits-title", currentLanguage === "id" ? "Batasan bukti" : "Evidence limitations");
      setText(".research-limits", research.limits);
      setText(".ingredient-links-title", currentLanguage === "id" ? "Baca publikasi asli" : "Read the original publications");
      setText(".ingredient-disclaimer", currentLanguage === "id"
        ? "Informasi ini bersifat edukasi kosmetik dan bukan pengganti saran tenaga medis. Hasil dapat berbeda pada setiap kulit."
        : "This cosmetic information is educational and does not replace medical advice. Results may vary by skin.");

      const list = ingredientModal.querySelector(".ingredient-benefit-list");
      list.replaceChildren(...content.benefits.map(benefit => {
        const item = document.createElement("li");
        item.textContent = benefit;
        return item;
      }));

      const sources = ingredientModal.querySelector(".ingredient-source-links");
      sources.replaceChildren(...ingredient.sources.map(source => {
        const link = document.createElement("a");
        link.href = source.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = `${source.title} ↗`;
        return link;
      }));

      ingredientModal.querySelector(".ingredient-modal-close").setAttribute(
        "aria-label",
        currentLanguage === "id" ? "Tutup detail ingredient" : "Close ingredient details"
      );
    }


    function openIngredient(index) {
      selectedIngredient = index;
      updateIngredientModal();
      const ingredientModal = getIngredientModal();
      ingredientModal.classList.add("active");
      document.body.classList.add("lock");
      ingredientModal.querySelector(".ingredient-modal-close").focus();
    }


    function closeIngredient() {
      const ingredientModal = document.getElementById("ingredientModal");
      if (!ingredientModal) return;
      ingredientModal.classList.remove("active");
      selectedIngredient = null;
      if (!modal.classList.contains("active")) document.body.classList.remove("lock");
    }


    /* ==========================================
       PRODUCT RENDER
    ========================================== */

    function renderProducts() {

      const grid =
        document.getElementById("productGrid");

      if (!grid) {
        return;
      }

      grid.innerHTML = "";


      products.forEach((product, index) => {

        const minPrice =
          Math.min(
            ...product.variants.map(
              variant => variant.price
            )
          );


        const priceLabel =
          product.variants.length > 1
            ? `${currentLanguage === "id"
                ? "Mulai"
                : "From"} ${rupiah(minPrice)}`
            : rupiah(minPrice);

        const firstVariant = product.variants[0];
        const oldPriceLabel = firstVariant.originalPrice
          ? `<span class="old-price">${rupiah(firstVariant.originalPrice)}</span>`
          : "";
        const cardImages = product.images?.length ? product.images : [product.image];


        const card =
          document.createElement("article");

        card.className =
          "product-card reveal";
        card.dataset.selectedVariant = product.variants.length > 1 ? "" : "0";


        card.innerHTML = `
          <div class="product-image">

            <img
              src="${cardImages[0]}"
              alt="${product.name[currentLanguage]}"
              loading="lazy"
            >

            ${cardImages.length > 1 ? `
              <div class="product-image-dots" aria-label="Galeri foto produk">
                ${cardImages.map((src, imageIndex) => `<button type="button" class="gallery-dot${imageIndex === 0 ? " active" : ""}" data-card-index="${imageIndex}" aria-label="Foto ${imageIndex + 1}"></button>`).join("")}
              </div>
            ` : ""}

            <span class="product-badge">
              ${product.variants[0].size}
              ${product.variants.length > 1
                ? "+"
                : ""}
            </span>

            ${product.isBundle ? "" : `<span class="product-bpom-badge">
              <span aria-hidden="true">✓</span>
              BPOM
            </span>`}

          </div>

          <div class="product-content">

            <div class="category">
              ${product.category[currentLanguage]}
            </div>

            <h3>
              ${product.name[currentLanguage]}
            </h3>

            <p class="product-desc">
              ${product.description[currentLanguage]}
            </p>

            ${product.isBundle ? "" : `<div class="product-bpom-status">
              <span class="product-bpom-check" aria-hidden="true">✓</span>
              <span>
                ${translation[currentLanguage].productBpomRegistered}
              </span>
              <strong>${product.bpom.number}</strong>
            </div>`}

            ${product.variants.length > 1 ? `
              <label class="card-variant-field">
                <span>${currentLanguage === "id" ? "Pilih ukuran" : "Choose size"}</span>
                <select class="card-variant-select" aria-label="${currentLanguage === "id" ? "Pilih ukuran produk" : "Choose product size"}">
                  <option value="" selected disabled>${currentLanguage === "id" ? "Pilih dahulu" : "Select first"}</option>
                  ${product.variants.map((variant, variantIndex) => `<option value="${variantIndex}">${variant.size} — ${rupiah(variant.price)}</option>`).join("")}
                </select>
              </label>
            ` : ""}

            <div class="price card-price">
              ${oldPriceLabel}
              ${priceLabel}
            </div>

            <div class="product-actions">

              <button
                class="small-btn"
                onclick="openProduct(${index})"
              >
                ${currentLanguage === "id"
                  ? "Detail"
                  : "Details"}
              </button>

              <button
                class="small-btn buy"
                onclick="quickBuy(${index}, this.closest('.product-card'))"
                ${product.variants.length > 1 ? "disabled" : ""}
              >
                ${currentLanguage === "id"
                  ? "Beli"
                  : "Buy"}
              </button>

            </div>

          </div>
        `;


        grid.appendChild(card);

        const variantSelect = card.querySelector(".card-variant-select");
        if (variantSelect) {
          variantSelect.addEventListener("change", () => {
            const variantIndex = Number(variantSelect.value);
            const variant = product.variants[variantIndex];
            card.dataset.selectedVariant = String(variantIndex);
            card.querySelector(".product-badge").textContent = variant.size;
            card.querySelector(".card-price").innerHTML = `${variant.originalPrice ? `<span class="old-price">${rupiah(variant.originalPrice)}</span>` : ""}${rupiah(variant.price)}`;
            const buyButton = card.querySelector(".small-btn.buy");
            buyButton.disabled = variant.available === false;
            window.dispatchEvent(new CustomEvent("mejavi:variant-change"));
          });
        }

        if (cardImages.length > 1) {
          const image = card.querySelector(".product-image img");
          const dots = [...card.querySelectorAll(".gallery-dot")];
          const showCardImage = (imageIndex) => {
            image.src = cardImages[imageIndex];
            dots.forEach((item, index) => item.classList.toggle("active", index === imageIndex));
          };
          dots.forEach((dot) => {
            dot.addEventListener("click", (event) => {
              event.stopPropagation();
              showCardImage(Number(dot.dataset.cardIndex));
            });
          });
          attachSwipeGallery(image.parentElement, cardImages.length, showCardImage);
        }
      });


      setTimeout(initReveal, 50);
    }

    // Bridge publik untuk sinkronisasi harga, diskon, dan stok dari Warehouse.
    window.mejaviProducts = products;

    // Dipanggil oleh store.js setelah katalog terbaru selesai diambil dari Warehouse.
    // Tanpa bridge ini, data berubah di memori tetapi kartu produk tidak dirender ulang.
    window.renderProducts = renderProducts;

    function attachSwipeGallery(element, imageCount, onChange) {
      if (!element || imageCount < 2) return;

      if (element._mejaviSwipeHandlers) {
        element.removeEventListener("touchstart", element._mejaviSwipeHandlers.start);
        element.removeEventListener("touchend", element._mejaviSwipeHandlers.end);
      }

      let startX = 0;
      let activeIndex = 0;
      const start = (event) => {
        startX = event.changedTouches[0].clientX;
      };
      const end = (event) => {
        const distance = event.changedTouches[0].clientX - startX;
        if (Math.abs(distance) < 42) return;
        activeIndex = distance < 0
          ? (activeIndex + 1) % imageCount
          : (activeIndex - 1 + imageCount) % imageCount;
        onChange(activeIndex);
      };

      element._mejaviSwipeHandlers = { start, end };
      element.addEventListener("touchstart", start, { passive: true });
      element.addEventListener("touchend", end, { passive: true });
    }


    /* ==========================================
       PRODUCT MODAL
    ========================================== */

    const modal =
      document.getElementById("productModal");


    function openProduct(index) {

      selectedProduct = index;
      selectedVariant = 0;

      updateModal();

      modal.classList.add("active");
      document.body.classList.add("lock");
    }


    function updateModal() {

      const product =
        products[selectedProduct];

      const variant =
        product.variants[selectedVariant];


      const modalImage = document.getElementById("modalImage");
      const galleryImages = product.images?.length ? product.images : [product.image];
      modalImage.src = galleryImages[0];
      modalImage.alt = product.name[currentLanguage];

      let modalGallery = document.getElementById("modalGallery");
      if (!modalGallery) {
        modalGallery = document.createElement("div");
        modalGallery.id = "modalGallery";
        modalGallery.className = "modal-gallery";
        modalImage.parentElement.appendChild(modalGallery);
      }
      modalGallery.innerHTML = galleryImages.map((src, imageIndex) => `
        <button type="button" class="modal-gallery-thumb${imageIndex === 0 ? " active" : ""}" data-image="${src}" aria-label="Foto ${imageIndex + 1}">
          <img src="${src}" alt="">
        </button>
      `).join("");
      const modalThumbs = [...modalGallery.querySelectorAll(".modal-gallery-thumb")];
      const showModalImage = (imageIndex) => {
        modalImage.src = galleryImages[imageIndex];
        modalThumbs.forEach((item, index) => item.classList.toggle("active", index === imageIndex));
        modalThumbs[imageIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      };
      modalThumbs.forEach((thumb, imageIndex) => {
        thumb.addEventListener("click", () => {
          showModalImage(imageIndex);
        });
      });
      attachSwipeGallery(modalImage.parentElement, galleryImages.length, showModalImage);


      document.getElementById(
        "modalCategory"
      ).textContent =
        product.category[currentLanguage];


      document.getElementById(
        "modalName"
      ).textContent =
        product.name[currentLanguage];


      document.getElementById("modalPrice").innerHTML =
        `${variant.size} • ${variant.originalPrice ? `<span class="old-price">${rupiah(variant.originalPrice)}</span>` : ""} ${rupiah(variant.price)}`;


      document.getElementById(
        "modalBenefits"
      ).textContent =
        product.benefits[currentLanguage];


      document.getElementById(
        "modalIngredientsText"
      ).textContent =
        product.ingredients[currentLanguage];


      document.getElementById(
        "modalHowText"
      ).textContent =
        product.how[currentLanguage];


      if (product.isBundle) {
        document.getElementById("modalBpom")?.remove();
      } else {
        renderModalBpom(product);
      }


      const variantWrap =
        document.getElementById("variantWrap");

      variantWrap.innerHTML = "";


      product.variants.forEach(
        (item, index) => {

          const button =
            document.createElement("button");

          button.className =
            "variant-btn" +
            (
              index === selectedVariant
                ? " active"
                : ""
            );


          button.textContent =
            `${item.size} • ${rupiah(item.price)}`;


          button.onclick = () => {

            selectedVariant = index;
            updateModal();

          };


          variantWrap.appendChild(button);
        }
      );
    }


    function renderModalBpom(product) {

      const bpom =
        product.bpom;

      const text =
        translation[currentLanguage];

      let section =
        document.getElementById("modalBpom");


      if (!section) {

        section =
          document.createElement("section");

        section.id = "modalBpom";
        section.className = "modal-bpom";


        const checkout =
          document.getElementById("checkoutBtn");

        checkout.parentNode.insertBefore(
          section,
          checkout
        );
      }


      section.innerHTML = `
        <div class="modal-bpom-header">
          <span class="modal-bpom-mark" aria-hidden="true">
            <svg viewBox="0 0 42 48">
              <path d="M21 3 38 9v12.5c0 11-6.8 19.9-17 24.1C10.8 41.4 4 32.5 4 21.5V9L21 3Z"></path>
              <path d="m13.5 23.5 5 5 10-11"></path>
            </svg>
          </span>

          <span>
            <small>${text.modalBpomTitle}</small>
            <strong>${text.productBpomRegistered}</strong>
          </span>
        </div>

        <div class="modal-bpom-details">
          <div class="modal-bpom-item">
            <span>${text.modalBpomNumber}</span>
            <strong class="modal-bpom-number">${bpom.number}</strong>
          </div>

          <div class="modal-bpom-item">
            <span>${text.modalBpomRegisteredName}</span>
            <strong>${bpom.registeredName}</strong>
          </div>

          <div class="modal-bpom-item">
            <span>${text.modalBpomManufacturer}</span>
            <strong>${bpom.manufacturer}</strong>
          </div>

          <div class="modal-bpom-item">
            <span>${text.modalBpomValidity}</span>
            <strong>${bpom.validity[currentLanguage]}</strong>
          </div>

          <div class="modal-bpom-item modal-bpom-item-wide">
            <span>${text.modalBpomPackaging}</span>
            <strong>${bpom.packaging[currentLanguage]}</strong>
          </div>
        </div>

        <div class="modal-bpom-actions">
          <a
            href="${bpom.verifyUrl}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${text.modalBpomVerify}
          </a>

          <a
            href="${bpom.certificate}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${text.modalBpomDocument}
          </a>
        </div>

        <a
          class="modal-bpom-preview"
          href="${bpom.certificate}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${text.modalBpomDocument}: ${product.name[currentLanguage]}"
        >
          <img
            src="${bpom.certificate}"
            alt="${text.modalBpomDocument} ${product.name[currentLanguage]}"
            loading="lazy"
          >

          <span>${text.modalBpomPreview} ↗</span>
        </a>

        <p class="modal-bpom-note">
          ${text.modalBpomNote}
        </p>
      `;
    }


    function closeProduct() {

      modal.classList.remove("active");
      document.body.classList.remove("lock");

    }


    document.getElementById(
      "modalClose"
    ).onclick = closeProduct;


    modal.addEventListener(
      "click",
      event => {

        if (event.target === modal) {
          closeProduct();
        }

      }
    );


    /* ==========================================
       CHECKOUT LYNK.ID
    ========================================== */

    document.getElementById(
      "checkoutBtn"
    ).onclick = function() {

      if (selectedProduct === null) {
        return;
      }


      const product =
        products[selectedProduct];

      const variant =
        product.variants[selectedVariant];


      if (window.mejaviStore) {
        window.mejaviStore.openCheckout(product, variant);
      } else {
        window.open(variant.lynk, "_blank", "noopener,noreferrer");
      }

    };


    function quickBuy(index, card) {

      selectedProduct = index;
      const product = products[index];
      const selected = card?.dataset.selectedVariant;

      if (product.variants.length > 1 && selected === "") {
        card?.querySelector(".card-variant-select")?.focus();
        return;
      }

      selectedVariant = selected === undefined || selected === "" ? 0 : Number(selected);

      const variant =
        product.variants[selectedVariant];


      if (window.mejaviStore) {
        window.mejaviStore.openCheckout(product, variant);
      } else {
        window.open(variant.lynk, "_blank", "noopener,noreferrer");
      }
    }


    /* ==========================================
       LANGUAGE
    ========================================== */

    function setLanguage(lang) {

      currentLanguage = lang;

      localStorage.setItem(
        "mejavi_language",
        lang
      );


      document.documentElement.lang = lang;


      document.querySelectorAll(
        "[data-id]"
      ).forEach(element => {

        const key =
          element.dataset.id;


        if (
          translation[lang] &&
          translation[lang][key] !== undefined
        ) {

          if (
            key === "heroTitle"
          ) {

            element.innerHTML =
              translation[lang][key];

          } else {

            element.textContent =
              translation[lang][key];

          }
        }

      });


      renderIngredients();
      renderProducts();


      if (selectedProduct !== null) {

        updateModal();

      }

      if (selectedIngredient !== null) {
        updateIngredientModal();
      }

    }


    document.getElementById(
      "langBtn"
    ).addEventListener(
      "click",
      () => {

        setLanguage(
          currentLanguage === "id"
            ? "en"
            : "id"
        );

      }
    );


    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;

      if (document.getElementById("ingredientModal")?.classList.contains("active")) {
        closeIngredient();
      } else if (modal.classList.contains("active")) {
        closeProduct();
      }
    });


    /* ==========================================
       MOBILE MENU
    ========================================== */

    const menuBtn =
      document.getElementById("menuBtn");

    const mobileMenu =
      document.getElementById("mobileMenu");

    const closeMenu =
      document.getElementById("closeMenu");

    const overlay =
      document.getElementById("overlay");


    function openMobileMenu() {

      mobileMenu.classList.add("active");
      overlay.classList.add("show");
      document.body.classList.add("lock");

    }


    function closeMobileMenu() {

      mobileMenu.classList.remove("active");
      overlay.classList.remove("show");
      document.body.classList.remove("lock");

    }


    menuBtn.onclick =
      openMobileMenu;

    closeMenu.onclick =
      closeMobileMenu;

    overlay.onclick =
      closeMobileMenu;


    document.querySelectorAll(
      ".mobile-links a"
    ).forEach(link => {

      link.addEventListener(
        "click",
        closeMobileMenu
      );

    });


    /* ==========================================
       FAQ
    ========================================== */

    document.querySelectorAll(
      ".faq-question"
    ).forEach(button => {

      button.addEventListener(
        "click",
        function() {

          const item =
            this.parentElement;

          const answer =
            item.querySelector(
              ".faq-answer"
            );


          const isActive =
            item.classList.contains(
              "active"
            );


          document.querySelectorAll(
            ".faq-item"
          ).forEach(otherItem => {

            otherItem.classList.remove(
              "active"
            );

            otherItem.querySelector(
              ".faq-answer"
            ).style.maxHeight = null;

          });


          if (!isActive) {

            item.classList.add(
              "active"
            );

            answer.style.maxHeight =
              answer.scrollHeight + "px";

          }

        }
      );

    });


    /* ==========================================
       NEWSLETTER
    ========================================== */

    function subscribe(event) {

      event.preventDefault();

      const email =
        document.getElementById(
          "newsletterEmail"
        ).value;


      alert(
        currentLanguage === "id"
          ? `Terima kasih! ${email} berhasil terdaftar.`
          : `Thank you! ${email} has been registered.`
      );


      event.target.reset();
    }

    const newsletterForm = document.getElementById("newsletterForm");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", subscribe);
    }


    /* ==========================================
       SCROLL ANIMATION
    ========================================== */

    let observer;


    function initReveal() {

      if (observer) {
        observer.disconnect();
      }


      observer =
        new IntersectionObserver(
          entries => {

            entries.forEach(entry => {

              if (entry.isIntersecting) {

                entry.target.classList.add(
                  "visible"
                );

                observer.unobserve(
                  entry.target
                );

              }

            });

          },
          {
            threshold: .08
          }
        );


      document.querySelectorAll(
        ".reveal:not(.visible)"
      ).forEach(element => {

        observer.observe(element);

      });

    }


    /* ==========================================
       LOADER
    ========================================== */

    window.addEventListener(
      "load",
      () => {

        setTimeout(
          () => {

            document.getElementById(
              "loader"
            ).classList.add("hide");

          },
          700
        );

      }
    );




    /* ==========================================
       ACTIVE PAGE NAVIGATION
    ========================================== */

    function markActivePage() {

      const activePage =
        document.body.dataset.page;

      document.querySelectorAll(
        "[data-page-link]"
      ).forEach(link => {

        const isActive =
          link.dataset.pageLink === activePage;

        link.classList.toggle("active", isActive);

        if (
          isActive &&
          (
            link.closest(".desktop-nav") ||
            link.closest(".mobile-links")
          )
        ) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }

      });
    }


    /* ==========================================
       INIT
    ========================================== */

    function initializeWebsite() {

      const year = document.getElementById("year");
      if (year) year.textContent = new Date().getFullYear();

      markActivePage();
      setLanguage(currentLanguage);
      initReveal();
      window.mejaviStore?.syncCatalog?.();
    }


    Promise.resolve(window.mejaviCMSReady)
      .then(content => {
        if (content) applyBackendContent(content);
      })
      .catch(() => {
        // Gunakan konten bawaan ketika backend tidak dapat dijangkau.
      })
      .finally(initializeWebsite);
