# Fonts embedded in the register's PDF export

`rs-regular.ttf` and `rs-bold.ttf` ("Register Sans") are Latin subsets (Basic Latin, Latin-1, Latin Extended-A and -B, general punctuation, euro sign, arrows) of **Liberation Sans 2** by Red Hat / Google, licensed under the **SIL Open Font License 1.1** (https://openfontlicense.org). They are renamed because the OFL asks modified versions not to use the original font names. Source copyright notice: `LICENSE-source.txt`.

They are embedded at build time (`build.mjs`) so the PDF prints every European letter (ä, ø, ł, ő, č …) without loading anything from the internet.
