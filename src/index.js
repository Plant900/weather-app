import "./styles.css"

// returns all relevant dom elements into 'dom' variable
function cacheDom() {
	let city = document.getElementById("city")
	let description = document.getElementById("description")
	let temp = document.getElementById("temp")
	let clouds = document.getElementById("clouds")
	let humidity = document.getElementById("humidity")
	let pressure = document.getElementById("pressure")
	let windSpeed = document.getElementById("windSpeed")

	let searchBar = document.getElementById("searchBar")
	let searchIcon = document.getElementById("searchIcon")

	let fBtn = document.getElementById("fBtn")

	return {
		city,
		description,
		temp,
		clouds,
		humidity,
		pressure,
		windSpeed,
		searchBar,
		searchIcon,
		fBtn,
	}
}
let dom = cacheDom()

// define outside async so can be accessed elsewhere
let myData

// takes city input, sends data into render
async function getWeather(city) {
	try {
		let weather = await fetch(
			`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8976198c0d715de77edea3b332a6b8f9`,
			{ mode: "cors" }
		)
		let allData = await weather.json()
		console.log(allData)
		myData = processData(allData)
		renderData(myData)
	} catch (err) {
		alert("City not found.")
	}
}

// takes data, applies info to dom
function renderData(data) {
	dom.city.textContent = data.name
	dom.description.textContent = data.description
	dom.temp.textContent = data.temp
	dom.clouds.textContent = `Cloud coverage: ${data.clouds}%`
	dom.humidity.textContent = `Humidity: ${data.humidity}%`
	dom.pressure.textContent = `Pressure: ${data.pressure}`
	dom.windSpeed.textContent = `Wind speed: ${data.windSpeed}m/s`
}

// search + search icon listeners
dom.searchBar.addEventListener("keyup", function (e) {
	if (e.key !== "Enter") {
		return
	}
	getWeather(dom.searchBar.value)
})
dom.searchIcon.addEventListener("click", function () {
	getWeather(dom.searchBar.value)
})

// takes relevant data from api call
function processData(data) {
	let name = `${data.name}, ${data.sys.country}`
	let description = data.weather[0].description
	let temp = `${Math.round(data.main.temp - 273)}°C`
	let clouds = data.clouds.all
	let humidity = data.main.humidity
	let pressure = data.main.pressure
	let windSpeed = data.wind.speed

	return {
		name,
		description,
		temp,
		clouds,
		humidity,
		pressure,
		windSpeed,
	}
}

// converts units
function convertTemp(temp) {
	if (temp.includes("°C")) {
		let newTemp = temp.slice(0, temp.length - 2)
		return `${Math.round(newTemp * (9 / 5) + 32)}°F`
	} else if (temp.includes("°F")) {
		let newTemp = temp.slice(0, temp.length - 2)
		return `${Math.round((newTemp - 32) * (5 / 9))}°C`
	}
}

// listener for convert btn
dom.fBtn.addEventListener("click", () => {
	myData.temp = convertTemp(myData.temp)
	renderData(myData)
})

// initialize page
getWeather("denver")
