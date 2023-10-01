require("dotenv").config();

const {
	leerInput,
	inquirerMenu,
	pausa,
	listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./helpers/models/busquedas");

const main = async () => {
	const busquedas = new Busquedas();

	let opt;

	do {
		//Imprimir el menu
		opt = await inquirerMenu();

		switch (opt) {
			case 1:
				// Mostar mensaje
				const lugar = await leerInput("Ciudad: ");
				await busquedas.cuidad(lugar);
				// Buscar los lugares
				const lugares = await busquedas.cuidad(lugar);

				// Seleccionar el ligar
				const id = await listarLugares(lugares);
				if (id === "0") continue;
				const lugarSel = lugares.find((l) => l.id === id);
				//Guardar en DB
				busquedas.agregarHistorial(lugarSel.nombre);

				// Clima
				const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
				// Mostar resultados

				console.log("\nInformacion de la ciudad\n".green);
				console.log("Ciudad:", lugarSel.nombre);
				console.log("Lat:", lugarSel.lat);
				console.log("Lng:", lugarSel.lng);
				console.log("Temperatura:", clima.temp);
				console.log("Minima:", clima.min);
				console.log("Maxima:", clima.max);
				console.log("Como esta el clima:", clima.desc.green);
				break;

			case 2:
				busquedas.historialCapatalizado.forEach((lugar, i) => {
					const idx = `${i + 1}.`.green;
					console.log(`${idx} ${lugar}`);
				});
				break;
		}

		// console.log({ opt });

		if (opt !== 0) await pausa();
	} while (opt !== 0);
};

main();
