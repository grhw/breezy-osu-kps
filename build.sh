mkdir dist/
echo "# -   Building for Linux   - #"
mkdir dist/linux

nuitka --onefile --standalone --output-dir=dist/linux/ \
       --enable-console --windows-icon-from-ico=src/internal/icon.ico \
       --output-filename=BreezyKPS src/main.py

cp src/internal dist/linux/internal
cp default_config.json dist/linux/config.json
echo "# -   Done building for Linux   - #"

echo "# -   Building for Windows   - #"
mkdir dist/windows

nuitka --mingw64 --windows-target \
       --onefile --standalone --output-dir=dist/linux/ \
       --enable-console --windows-icon-from-ico=src/internal/icon.ico \
       --output-filename=BreezyKPS.exe src/main.py

cp src/internal dist/windows/internal
cp default_config.json dist/windows/config.json
echo "# -   Done building for Windows   - #"