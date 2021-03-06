if [ $# -ne 1 ]; then
  echo "Usage: <App Name>"
  exit
fi

printf -v N "%02d" "$(find . -mindepth 1 -maxdepth 1 -type d | wc -l)"

expo init "$1"
mv "$1" "$N-$1"
cd "$N-$1" || exit

# Remove Git (Automatic Generated)
rm -r .git
rm .gitignore

# Install ESLint
npm install --save-dev eslint
npm install --save-dev eslint-config-airbnb-typescript
npm install --save-dev eslint-plugin-import
npm install --save-dev eslint-plugin-jsx-a11y
npm install --save-dev eslint-plugin-react
npm install --save-dev eslint-plugin-react-hooks
npm install --save-dev eslint-plugin-react-native
npm install --save-dev @typescript-eslint/eslint-plugin
npm install --save-dev @typescript-eslint/parser

cp ../.eslintrc.default.js .eslintrc.js
