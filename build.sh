rm -r dist/
mkdir dist/

nuitka --mode=app --output-dir=dist/ \
       --enable-console --windows-icon-from-ico=src/internal/icon.ico \
       --output-filename=BreezyKPS src/main.py

cp -r src/internal dist/internal
cp default_config.json dist/config.json