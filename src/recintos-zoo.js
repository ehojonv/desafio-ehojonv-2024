const animaisPermitido = {
    LEAO: { tamanho: 3, bioma: ["savana"], carnivoro: true },
    LEOPARDO: { tamanho: 2, bioma: ["savana"], carnivoro: true },
    CROCODILO: { tamanho: 3, bioma: ["rio"], carnivoro: true },
    MACACO: { tamanho: 1, bioma: ["savana", "floresta"], carnivoro: false },
    GAZELA: { tamanho: 2, bioma: ["savana"], carnivoro: false },
    HIPOPOTAMO: { tamanho: 4, bioma: ["savana", "rio"], carnivoro: false }
};

const recintosExistente = [
    { id: 1, bioma: ["savana"], tamanhoTotal: 10, animais: [{ quantidade: 3, tipo: "MACACO" }] },
    { id: 2, bioma: ["floresta"], tamanhoTotal: 5, animais: [] },
    { id: 3, bioma: ["savana", "rio"], tamanhoTotal: 7, animais: [{ quantidade: 1, tipo: "GAZELA" }] },
    { id: 4, bioma: ["rio"], tamanhoTotal: 8, animais: [] },
    { id: 5, bioma: ["savana"], tamanhoTotal: 9, animais: [{ quantidade: 1, tipo: "LEAO" }] }
];

function checarBioma(animal, recinto) {
    return animaisPermitido[animal].bioma.some(bioma => recinto.bioma.includes(bioma))
}

function checarEspacoRecinto(animal, recinto, quantidade) {

    let espacoOcupado = 0;

    recinto.animais.forEach(a => {
        espacoOcupado += a.quantidade * animaisPermitido[a.tipo].tamanho
    });
    let espacoVazio = recinto.tamanhoTotal - espacoOcupado;

    if (recinto.animais.some(a => animaisPermitido[a.tipo] != animaisPermitido[animal])) {
        espacoVazio -= 1
    }

    return espacoVazio;
}

function checarCarnivoro(animal, recinto) {
    if (animaisPermitido[animal].carnivoro == true) {
        if (recinto.animais.some(a => animaisPermitido[a.tipo] != animaisPermitido[animal])) return false;
        return true;
    } else if (recinto.animais.some(a => animaisPermitido[a.tipo].carnivoro == true)) return false;
    return true;
}

function checarRegras(animal, recinto, quantidade) {

    if (animal === "HIPOPOTAMO") {
        if (recinto.animais.some(a => animaisPermitido[a.tipo] != animaisPermitido[animal])) {
            if (recinto.bioma.includes("savana" && "rio")) return true;
            else return false;
        } else return true;
    }

    if (animal === "MACACO") {
        if (quantidade > 1) return true;
        else if (recinto.animais.some(a => a.quantidade > 0)) return true;
        else return false;
    }

    return true
}

function checarRecinto(animal, recinto, quantidade) {

    if (checarBioma(animal, recinto)
        && checarEspacoRecinto(animal, recinto, quantidade) >= animaisPermitido[animal].tamanho * quantidade
        && checarCarnivoro(animal, recinto)
        && checarRegras(animal, recinto, quantidade)) {
        return true;
    }
    return false;
}

class RecintosZoo {

    analisaRecintos(animal, quantidade) {
        if (!(animal in animaisPermitido)) return {
            erro: "Animal inválido",
            recintosViaveis: null
        };
        if (quantidade <= 0 || !Number.isInteger(quantidade)) return {
            erro: "Quantidade inválida",
            recintosViaveis: null
        };

        let recintosViaveis = recintosExistente.filter(recinto => checarRecinto(animal, recinto, quantidade))
            .map(recinto => (`Recinto ${recinto.id} (espaço livre: ${checarEspacoRecinto(animal, recinto, quantidade) - animaisPermitido[animal].tamanho * quantidade} total: ${recinto.tamanhoTotal})`));

        if (recintosViaveis.length == 0) return {
            erro: "Não há recinto viável",
            recintosViaveis: null
        };
        else return {
            erro: null,
            recintosViaveis: recintosViaveis
        };
    }

}

console.log(new RecintosZoo().analisaRecintos("LEAO",5))

export { RecintosZoo as RecintosZoo };