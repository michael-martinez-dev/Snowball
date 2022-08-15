APP_NAME=debt-snowball
APP_VERSION=v0.3.0


.PHONEY: run dev prod clean
build:
	wails build

run:
	./build/bin/${APP_NAME}.exe

dev:
	wails dev

prod:
	wails build -platform windows -o ${APP_NAME}-${APP_VERSION}.exe -upx -race
	wails build -platform darwin -o ${APP_NAME}-${APP_VERSION} -upx -race
	wails build -platform linux -o ${APP_NAME}-${APP_VERSION} -upx -race

clean:
	rm -f ./build/bin/${APP_NAME}-${APP_VERSION}*
