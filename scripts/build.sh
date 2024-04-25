OUTPUT_DIR=dist

rm -rf $OUTPUT_DIR

bun build src/index.ts --outdir $OUTPUT_DIR --entry-naming "[name].esm.[ext]"   --asset-naming "[name].[ext]"

lessc --js --silent src/style.less $OUTPUT_DIR/style.css
