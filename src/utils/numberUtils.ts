export const numberUtils = () => {
    const num2Letters = (number: number) => {
        if (isNaN(number) || number < 0 || 999 < number) {
            return 'Veuillez entrer un nombre entier compris entre 0 et 999.';
        }

        let units2Letters = ['', 'un', 'deux', 'trois', 'quatre', 'cinq',
            'six', 'sept', 'huit', 'neuf', 'dix', 'onze',
            'douze', 'treize', 'quatorze', 'quinze', 'seize',
            'dix-sept', 'dix-huit', 'dix-neuf'],
            tens2Letters = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante',
                'soixante', 'quatre-vingt', 'quatre-vingt'];

        let units = number % 10,
            tens = (number % 100 - units) / 10,
            hundreds = (number % 1000 - number % 100) / 100;

        let unitsOut, tensOut, hundredsOut;

        if (number === 0) {
            return 'zéro ';
        } else {

            // Traitement des unités

            unitsOut = (units === 1 && tens > 0 && tens !== 8 ? 'et-' : '') + units2Letters[units];

            // Traitement des dizaines

            if (tens === 1 && units > 0) {
                tensOut = units2Letters[10 + units];
                unitsOut = '';
            } else if (tens === 7 || tens === 9) {
                tensOut = tens2Letters[tens] + '-' + (tens === 7 && units === 1 ? 'et -' : '') + units2Letters[10 + units];
                unitsOut = '';
            } else {
                tensOut = tens2Letters[tens];
            }

            tensOut += (units === 0 && tens === 8 ? 's' : '');

            // Traitement des centaines

            hundredsOut = (hundreds > 1 ? units2Letters[hundreds] + '-' : '') + (hundreds > 0 ? 'cent' : '') + (hundreds > 1 && tens === 0 && units === 0 ? 's' : '');

            // Retour du total

            return hundredsOut + (hundredsOut && tensOut ? '-' : '') + tensOut + ((hundredsOut && unitsOut) || (tensOut && unitsOut) ? '-' : '') + unitsOut;
        }
    };

    const getMilliards = (number: string) => {
        let str = number;

        switch (str.length) {
            case 12:
                return str[0] + str[1] + str[2];
            case 11:
                return str[0] + str[1];
            case 10:
                return str[0];
            default:
                return '0';
        }
    };

    const numberToLetters = (n: string) => {
        let result = '';
        const number = Number(n);
        const milliards = Number(getMilliards(n));
        const millions = Math.floor((number / 1000000) - milliards * 1000);
        const milliers = Math.floor((number / 1000) - milliards * 1000000 - millions * 1000);
        const centaines = Math.floor((number) - milliards * 1000000000 - millions * 1000000 - milliers * 1000);

        //console.log(milliards, ' - ', millions, ' - ', milliers, ' - ', centaines)

        result += (milliards > 0 ? num2Letters(milliards) + ' milliard' + (milliards > 1 ? 's ' : ' ') : '');
        result += (millions > 0 ? num2Letters(millions) + ' million' + (millions > 1 ? 's ' : ' ') : '');
        result += (milliers > 0 ? (milliers > 1 ? num2Letters(milliers) + ' mille' : 'mille') + (milliers > 1 ? 's ' : '') : '');
        result += (centaines > 0 ? ' ' + num2Letters(centaines) : '');

        return result;
    };

    const floatToLetters = (number: string | number) => {
        let str = String(number),
            result = '';

        const entiere = str.split('.', 10)[0],
            decimale = (str.split('.', 10)[1]);

        result += numberToLetters(entiere);
        result += (parseInt(decimale) > 0 ? ' virgule ' + numberToLetters(decimale) : '');

        return result;
    };



    return {
        num2Letters,
        floatToLetters
    }
};