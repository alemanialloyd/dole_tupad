import { createContext, useState } from "react";

export const StaticContext = createContext({
    municipalities: [],
    bicol: [],
    basud: [],
    capalonga: [],
    daet: [],
    jpang: [],
    labo: [],
    mercedes: [],
    paracale: [],
    slr: [],
    sv: [],
    se: [],
    talisay: [],
    vinzons: [],
});

const municipalitiesArray = ["Basud", "Capalonga", "Daet", "Jose Panganiban", "Mercedes", "Labo", "Paracale", "San Lorenzo Ruiz", "San Vicente", "Sta Elena", "Talisay", "Vinzons"]
const bicolArray = ["Basud", "Daet", "Mercedes", "San Lorenzo Ruiz", "San Vicente", "Talisay", "Vinzons"]
const basudArray = ["Angas", "Bactas", "Binatagan", "Caayunan", "Guinatungan", "Hinampacan", "Langa", "Laniton", "Lidong", "Mampili", "Mandazo", "Mangcamagong", "Manmuntay", "Mantugawe",
            "Matnog", "Mocong", "Oliva", "Pagsangahan", "Pinagwarasan", "Plaridel", "Poblacion 1", "Poblacion 2", "San Felipe", "San Jose", "San Pascual", "Taba-taba", "Tacad", "Taisan", "Tuaca"]
const capalongaArray = ["Alayao", "Binawangan", "Calabaca", "Camagsaan", "Catabaguangan", "Catioan", "Del Pilar", "Itok", "Lucbanan", "Mabini", "Mactang", "Mataque", "Old Camp", "Poblacion",
            "Magsaysay", "San Antonio", "San Isidro", "San Roque", "Tanauan", "Ubang", "Villa Aurora", "Villa Belen"]
const daetArray = ["Alawihao", "Awitan", "Bagasbas", "Barangay I (Ilaod)", "Barangay II (Pasig)", "Barangay III (Iraya)", "Barangay IV (Mantagbac)", "Barangay V (Pandan)",
            "Barangay VI (Centro)", "Barangay VII (Diego Liñan)", "Barangay VIII (Salcedo)", "Bibirao", "Borabod", "Calasgasan", "Camambugan", "Cobangbang", "Dogongan", "Gahonon",
            "Gubat", "Lag-on", "Magang", "Mambalite", "Pamorangon", "Mancruz", "San Isidro"]
const jpangArray = ["Bagong Bayan", "Calero", "Dahican", "Dayhagan", "Larap", "Luklukan Norte", "Luklukan Sur", "Motherlode", "Nakalaya", "Osmeña", "Pag-asa", "Parang", "Plaridel", "North Poblacion",
            "South Poblacion", "Salvacion", "San Isidro", "San Jose", "San Martin", "San Pedro", "San Rafael", "Santa Cruz", "Santa Elena", "Santa Milagrosa", "Santa Rosa Norte",
            "Santa Rosa Sur", "Tamisan"]
const laboArray = ["Anahaw", "Anameam", "Awitan", "Baay", "Bagacay", "Bagong Silang I", "Bagong Silang II", "Bagong Silang III", "Bakiad", "Bautista", "Bayabas", "Bayan-bayan", "Benit", "Bulhao",
            "Cabatuhan", "Cabusay", "Calabasa", "Canapawan", "Daguit", "Dalas", "Dumagmang", "Exciban", "Fundado", "Guinacutan", "Guisican", "Gumamela", "Iberica", "Kalamunding", "Lugui",
            "Mabilo I", "Mabilo II", "Macogon", "Mahawan-hawan", "Malangcao-basud", "Malasugui", "Malatap", "Malaya", "Malibago", "Maot", "Masalong", "Matanlang", "Napaod", "Pag-asa",
            "Pangpang", "Pinya", "San Antonio", "San Francisco", "Santa Cruz", "Submakin", "Talobatib", "Tigbinan", "Tulay Na Lupa"]
const mercedesArray = ["Apuao", "Barangay I", "Barangay II", "Barangay III", "Barangay IV", "Barangay V", "Barangay VI", "Barangay VII", "Caringo", "Catandunganon", "Cayucyucan", "Colasi", "Del Rosario",
            "Gaboc", "Hamoraon", "Hinipaan", "Lalawigan", "Lanot", "Mambungalon", "Manguisoc", "Masalongsalong", "Matoogtoog", "Pambuhan", "Quinapaguian", "San Roque", "Tarum"]
const paracaleArray = ["Awitan", "Bagumbayan", "Bakal", "Batobalani", "Calaburnay", "Capacuan", "Casalugan", "Dagang", "Dalnac", "Dancalan", "Gumaus", "Labnig", "Macolabo Island", "Malacbang", "Malaguit",
            "Mampungo", "Mangkasay", "Maybato", "Palanas", "Pinagbirayan Malaki", "Pinagbirayan Munti", "Poblacion Norte", "Poblacion Sur", "Tabas", "Talusan", "Tarum", "Tawig", "Tugos"]
const slrArray = ["Daculang Bolo", "Dagotdotan", "Langga", "Laniton", "Maisog", "Mampurog", "Manlimonsito", "Matacong", "Salvacion", "San Antonio", "San Isidro", "San Ramon"]
const svArray = ["Asdum", "Cabanbanan", "Calabagas", "Fabrica", "Iraya Sur", "Kanluran", "Man-ogob", "San Jose", "Silangan"]
const seArray = ["Basiad", "Bulala", "Don Tomas", "Guitol", "Maulawin", "Kabuluan", "Kagtalaba", "Patag Ibaba", "Patag Ilaya", "Plaridel", "Poblacion", "Polungguitguit", "Rizal", "Salvacion", "San Lorenzo",
            "San Pedro", "San Vicente", "Tabugon", "Villa San Isidro"]
const talisayArray = ["Binanuaan", "Caawigan", "Cahabaan", "Calintaan", "Del Carmen", "Gabon", "Itomang", "Poblacion", "San Francisco", "San Isidro", "San Jose", "San Nicolas", "Santa Cruz", "Santa Elena"]
const vinzonsArray = ["Aguit-it", "Banocboc", "Cagbalogo", "Calangcawan Norte", "Calangcawan Sur", "Guinacutan", "Mangcayo", "Mangcawayan", "Manlucugan", "Matango", "Napilihan", "Pinagtigasan",
            "Barangay I", "Barangay II", "Barangay III", "Sabang", "Santo Domingo", "Singi", "Sula"]

export const StaticProvider = ({ children }) => {
    const [municipalities] = useState(municipalitiesArray);
    const [bicol] = useState(bicolArray);
    const [basud] = useState(basudArray);
    const [capalonga] = useState(capalongaArray);
    const [daet] = useState(daetArray);
    const [jpang] = useState(jpangArray);
    const [labo] = useState(laboArray);
    const [mercedes] = useState(mercedesArray);
    const [paracale] = useState(paracaleArray);
    const [slr] = useState(slrArray);
    const [sv] = useState(svArray);
    const [se] = useState(seArray);
    const [talisay] = useState(talisayArray);
    const [vinzons] = useState(vinzonsArray);

    const value = {municipalities, bicol, basud, capalonga, daet, jpang, labo, mercedes, paracale, slr, sv, se, talisay, vinzons};

    return <StaticContext.Provider value={value}>{children}</StaticContext.Provider>
} 