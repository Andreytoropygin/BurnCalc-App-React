import type { CompoundResponseDto } from "../api/Api";

export const COMPOUNDS_MOCK: CompoundResponseDto[] = [
    {
        id: 1,
        title: "Метан",
        formula: "CH₄",
        class: "Алканы",
        specificH2oVolume: 44.8,
        specificCo2Volume: 22.4,
        imageUrl: null,
        videoUrl: null,
        description_eng: "A dark sphere bonded to four lighter spheres in a tetrahedral arrangement, representing a simple molecular structure with symmetrical geometry",
        description_rus: "Центральный атом углерода связан с четырьмя водородами в тетраэдрической геометрии - простейшая органическая молекула"
    },
    {
        id: 2,
        title: "Этилен",
        formula: "C₂H₄",
        class: "Алкены",
        specificH2oVolume: 44.8,
        specificCo2Volume: 44.8,
        imageUrl: null,
        videoUrl: null,
        description_eng: "Two dark spheres double-bonded, each attached to two light spheres — a planar, symmetrical molecule with trigonal geometry around each central atom",
        description_rus: "Два атома углерода соединены двойной связью, каждый несёт по два водорода - плоская симметричная структура, типичный алкен"
    },
    {
        id: 3,
        title: "Ацетилен",
        formula: "C₃H₈",
        class: "Алкины",
        specificH2oVolume: 22.4,
        specificCo2Volume: 44.8,
        imageUrl: null,
        videoUrl: null,  
        description_eng: "A linear molecule with two large dark spheres flanked by smaller light spheres, suggesting a core with terminal atoms in a straight-line arrangement",
        description_rus: "Линейная молекула: два углерода тройной связью, на концах по одному водороду. Минималистичная и жёсткая структура"
    },
    {
        id: 4,
        title: "Бензол",
        formula: "C₆H₆",
        class: "Арены",
        specificH2oVolume: 67.2,
        specificCo2Volume: 134.4,
        imageUrl: null,
        videoUrl: null,
        description_eng: "A ball-and-stick model of a small organic molecule: six black carbon atoms in a ring, each bonded to one white hydrogen atom",
        description_rus: "Шесть углеродов в кольце, каждый связан с двумя водородами - объёмная «кресловидная» конформация, насыщенный циклоалкан"
    },
    {
        id: 5,
        title: "Этанол",
        formula: "C₂H₅OH",
        class: "Спирты",
        specificH2oVolume: 67.2,
        specificCo2Volume: 44.8,
        imageUrl: null,
        videoUrl: null,
        description_eng: "A ball-and-stick ethanol molecule model: two carbons, one oxygen and six hydrogens",
        description_rus: "Два углерода, один из них несёт гидроксильную группу (OH) - простой спирт, полярный конец, неполярный хвост"
    },
    {
        id: 7,
        title: "Название",
        formula: "Формула",
        class: "Органические",
        specificH2oVolume: 0,
        specificCo2Volume: 0,
        imageUrl: null,
        videoUrl: null,
        description_eng: "Abstract of compound, no image",
        description_rus: "Описание на русском языке"
    },
];