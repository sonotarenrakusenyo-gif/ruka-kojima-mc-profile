#!/usr/bin/env python3
"""Generate profile summary PDF from site content."""

from pathlib import Path
from fpdf import FPDF

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "小島瑠夏_プロフィール資料.pdf"
OUTPUT_ASCII = ROOT / "ruka-kojima-profile.pdf"  # Finder で探しやすい名前
FONT_DIR = ROOT / "fonts"
FONT_PATH = FONT_DIR / "ArialUnicode.ttf"
SYSTEM_FONT = Path("/System/Library/Fonts/Supplemental/Arial Unicode.ttf")


class ProfilePDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("JP", size=8)
        self.set_text_color(140, 140, 140)
        self.cell(0, 8, "小島 瑠夏 | MC Ruka Kojima Official Profile", align="R")
        self.ln(4)

    def footer(self):
        self.set_y(-12)
        self.set_font("JP", size=8)
        self.set_text_color(140, 140, 140)
        self.cell(0, 8, f"Page {self.page_no()}/{{nb}}", align="C")


def section_title(pdf, title, subtitle=""):
    pdf.ln(4)
    pdf.set_font("JP", size=12)
    pdf.set_text_color(26, 26, 26)
    line = title
    if subtitle:
        line += f"  ({subtitle})"
    pdf.multi_cell(0, 7, line)
    pdf.set_draw_color(201, 168, 124)
    pdf.set_line_width(0.6)
    pdf.line(pdf.l_margin, pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y())
    pdf.ln(3)


def subsection(pdf, title):
    pdf.ln(2)
    pdf.set_font("JP", size=10)
    pdf.set_text_color(51, 51, 51)
    pdf.multi_cell(0, 6, title)


def subsubsection(pdf, title):
    pdf.ln(1)
    pdf.set_font("JP", size=9)
    pdf.set_text_color(85, 85, 85)
    pdf.multi_cell(0, 5, title)


def body_text(pdf, text):
    pdf.set_x(pdf.l_margin)
    pdf.set_font("JP", size=9)
    pdf.set_text_color(26, 26, 26)
    pdf.multi_cell(0, 5.5, text)
    pdf.ln(1)


def bullet_list(pdf, items):
    pdf.set_x(pdf.l_margin)
    pdf.set_font("JP", size=8.5)
    pdf.set_text_color(26, 26, 26)
    for item in items:
        pdf.set_x(pdf.l_margin)
        pdf.multi_cell(0, 5, f"・{item}")
    pdf.ln(1)


def build_pdf():
    pdf = ProfilePDF(orientation="P", unit="mm", format="A4")
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=18)

    font_file = str(SYSTEM_FONT if SYSTEM_FONT.exists() else FONT_PATH)
    pdf.add_font("JP", "", font_file)

    pdf.add_page()

    # Cover portrait
    portrait = ROOT / "images" / "profile-1.jpg"
    if portrait.exists():
        img_w = 42
        x = (pdf.w - img_w) / 2
        pdf.image(str(portrait), x=x, y=18, w=img_w)
        pdf.set_y(18 + img_w * 1.35 + 4)

    # Cover
    pdf.set_font("JP", size=22)
    pdf.set_text_color(26, 26, 26)
    pdf.cell(0, 14, "小島 瑠夏", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("JP", size=11)
    pdf.set_text_color(102, 102, 102)
    pdf.cell(0, 8, "Ruka Kojima ／ MC / Narrator / Model", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)
    pdf.set_font("JP", size=12)
    pdf.set_text_color(26, 26, 26)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 7, "「声」で心を動かし、その瞬間に響く特別な体験を。", align="C")
    pdf.ln(4)
    pdf.set_x(pdf.l_margin)
    pdf.set_font("JP", size=9.5)
    body_text(
        pdf,
        "スポーツ、式典、企業イベント、ラジオ、展示会など、幅広いシーンでご期待に応えるMC・ナレーターとして活動中。明るく丁寧な進行で、伝えたい想いをまっすぐ届けます。",
    )
    pdf.ln(2)
    pdf.set_fill_color(245, 240, 232)
    pdf.set_font("JP", size=9)
    pdf.set_x(pdf.l_margin)
    pdf.cell(0, 8, "公式プロフィールサイト", align="C", new_x="LMARGIN", new_y="NEXT", fill=True)
    pdf.set_font("JP", size=9)
    pdf.set_x(pdf.l_margin)
    pdf.cell(0, 8, "https://ruka-kojima-mc-profile.vercel.app", align="C", new_x="LMARGIN", new_y="NEXT", fill=True)
    pdf.ln(6)

    section_title(pdf, "About Me", "プロフィール")
    body_text(
        pdf,
        "MC歴10年目となっております。MC、ナレーター、レポーターとしてスタジアムなどでのスポーツや大型イベント、式典、展示会、講演会、YouTubeなど多方面で出演中。特別なひとときを、「声」で彩ります。\n"
        "また広告モデルやインフルエンサーPR案件なども行っております。AIや政治経済に興味があり、ただいま勉強中です。\n"
        "メインSNSのPR案件は主にグルメ・美容・旅行を扱っております。",
    )
    body_text(pdf, "出身：神奈川県 藤沢市")
    body_text(pdf, "MCキャリア：10年　／　出演実績：+200 Events")
    subsection(pdf, "資格・検定")
    bullet_list(
        pdf,
        ["着物の着付け師範", "食生活アドバイザー", "食品衛生責任者", "パンシェルジュベーシック"],
    )
    subsection(pdf, "趣味")
    body_text(pdf, "パン作り、マッサージ、声楽")

    section_title(pdf, "主なお仕事", "Featured Works")
    bullet_list(
        pdf,
        [
            "長谷部誠選手 契約延長記者会見",
            "ラグビーW杯 パブリックビューイング",
            "東京モーターショー",
            "東京ゲームショー",
            "テレビ東京「電波独占！Matt様のお買い物」ヘアモデル",
        ],
    )

    section_title(pdf, "Gallery", "宣材写真")
    body_text(
        pdf,
        "公式サイトにスーツ・イベントMC・着物・ドレスなど計22枚の宣材写真を掲載しています。詳細は上記URLよりご覧ください。",
    )

    section_title(pdf, "Works", "活動実績")

    subsection(pdf, "スポーツ経歴")
    bullet_list(
        pdf,
        [
            "NTTジャパンラグビー リーグワン 2023年度〜2025年度 横浜キヤノンイーグルス アリーナサブMC",
            "Bリーグ サンロッカーズ渋谷 サブMC",
            "Bリーグ 横浜エクセレンス サブMC",
            "第1回 日本社会人バスケットボールリーグ／SBL-SB1 2024-25 メインMC",
            "横浜キヤノンイーグルス サポーター感謝祭",
            "横浜キヤノンイーグルス 終了報告記者発表会",
            "ラグビーW杯2023 日本vsチリ パブリックビューイング（サントリーサンゴリアス 平浩二さんとトークショー）",
            "徹底解説！PIST6 実況生放送（競輪）",
            "パラリンピック五輪委員会主催 東京2020大会 感動をありがとうイベント in TAMA（トークショー：黒田智成さん・土田和歌子さん）",
            "Sansan Reboot Next",
            "あしざるFC F GAME アシスタントMC",
        ],
    )

    subsection(pdf, "トークショー・記者発表")
    subsubsection(pdf, "■ トークショー")
    bullet_list(
        pdf,
        [
            "小倉優子（ゆうこりん）",
            "トムブラウン",
            "ゆうちゃみ",
            "近藤真彦",
            "マーシュ彩",
            "るるたいカップル",
            "メイクアップアーティスト 夢月",
            "メイクアップアーティスト 石川ゆうき",
            "もえあず（もえのあずき）",
            "橋本梨菜",
            "小鹿純子（荒木由美子）",
        ],
    )
    subsubsection(pdf, "■ 記者・新製品発表")
    bullet_list(
        pdf,
        [
            "長谷部誠選手 契約延長記者会見",
            "横浜キヤノンイーグルス 終了報告記者発表会",
            "日本スキー場開発 PRイベント（ゲスト 小倉優子）",
            'マーシュ彩「Christmas GARDEN "バンブーアート インスタレーション"」お披露目イベント',
            "小滝水音プロ 優勝祝賀会（ゴルフ）",
            "八芳園MuSuBu 福島県鏡石町 いちごフェア 新商品発表会",
        ],
    )

    subsection(pdf, "イベント")
    bullet_list(
        pdf,
        [
            "東京モーターショー SUZUKI",
            "東京モーターショー 豊田合成",
            "東京オートサロン Clarion",
            "アークナイツ 6TH Anniversary Fes.「Continuum」",
            "三菱地所主催「E＆Jフェス」",
            "東京ゲームショー CROOZ blockchain labo / gumi",
            "17 GIRLS & RUNWAY 2022",
            "Lemon8 ベストアワード2022",
            "ららぽーと横浜 韓国フェア SPECIALイベント（ゆうちゃみトークショー）",
            "「777シリーズ × 名代富士そば」コラボお披露目イベント",
            "クラシエホームプロダクツ NUAN × るるたいカップル トークイベント",
            "板橋区書き初め大会 in 大東文化大学（ゲスト 杉浦太陽）",
            "ロフト コスメフェスティバル 2023 スプリングサマー 2nd",
            "隅田川花火大会 納涼パーティー",
            "ミス・アースジャパン 東京大会",
            "ミス・アースジャパン 埼玉大会",
            "ミス・アースジャパン 東北合同大会",
            "など他多数",
        ],
    )

    subsection(pdf, "料理系")
    bullet_list(
        pdf,
        [
            "スイーツ甲子園 スーパーライブ supported by 中沢乳業",
            "第16回スイーツ甲子園 高校生パティシエNo.1決定戦 全国大会予選 東日本ブロック",
            "第16回スイーツ甲子園 高校生パティシエNo.1決定戦 全国決勝大会",
            "八芳園クッキングイベント",
            "ハルハルおきなわ × 人気料理YouTuber リュウジ スペシャル飲み会",
        ],
    )

    pdf.add_page()

    subsection(pdf, "展示会・セミナー・他")
    subsubsection(pdf, "■ 展示会・セミナー")
    bullet_list(
        pdf,
        [
            "危機管理産業展2025",
            "PACK2025 日立産機システムブース",
            "2025国際ロボット展／不二越様ブース",
            "オートサービスショー 明治産業",
            "Japan IT Week 春2025／CYLLENGE様ブース",
            "Interop Tokyo 2025",
            "Veeam共催セミナー",
            "Lenovo Customer Advisory Council 2023",
            "国際福祉機器展 MAZDA",
            "Fortinet Executive Forum 2023 Kyoto",
            "Slackウェビナー",
            "国際福祉機器展 ブルーオーシャンシステム",
            "Reuse×Tech Conference for 2024",
            "弥生 PAP カンファレンス 2023 秋",
            "HR CAMP",
            "ロボデックス 豊田合成",
            "12月不動産テックEXPO KDDI",
            "国際物流総合展 日本自動車ターミナル(株)",
            "JISSO PROTEC Panasonic",
            "デジタルサイネージジャパン フィリップス",
            "TOSHIBA OPEN INNOVATION FAIR",
            "グランドフェア ユアサ商事",
            "ビルメンヒューマンフェア&クリーンEXPO Panasonic",
            "プラントショー 鶴見製作所",
            "エコプロ トヨタ",
            "エコプロ ENEOS",
            "NTT communication forum",
            "Photo Next Canon",
            "金融国際情報展 EPSON",
            "CEATEC JAPAN Panasonic",
            "CEATEC JAPAN AMADA",
            "CEATEC TEコネクティビティ",
            "東京マラソンEXPO",
            "ET展 株式会社コア",
            "スマート工場EXPO 東洋ビジネスエンジニアリング",
            "IoT M2M 東洋ビジネスエンジニアリング",
            "大塚商会 実践ソリューションフェア",
            "日経産業新聞フォーラム",
            "MPOWER",
            "Web担当者Forumミーティング",
            "国際・ホテルレストランショー NEC",
            "システムコントロールフェア 日東工業",
            "SAS Institute Japan 顧客向けクローズイベント（分科会）",
            "リテールテック 東芝テック",
            "就活開幕LIVE",
            "住まいるフェスタ",
            "ツーリズムEXPOジャパン アエロフロートロシア航空",
            "第62回マーケティング総合大会",
            "イーコマースフェア東京2026",
            "NTTデータイントラマート IM Live2025",
        ],
    )
    subsubsection(pdf, "■ オンライン")
    bullet_list(
        pdf,
        [
            "東京ゲームショー バンダイナムコ",
            "内閣府主催 SIP/PRISMシンポジウム2022",
            "文化庁主催 日本語オンライン実証事業",
            "KDDIオンラインセミナー",
            "DNPオンライン展示会",
            "楽天 みん就",
            "ユーシービージャパン講演会",
        ],
    )

    subsection(pdf, "ラジオ・リポーター")
    subsubsection(pdf, "■ ラジオ")
    bullet_list(pdf, ["FM浦安 ゲスト出演", "渋谷クロスFM ゲスト出演"])
    subsubsection(pdf, "■ リポーター")
    bullet_list(
        pdf,
        [
            "テレビ朝日主催 ゴーテック2022（オンライン）",
            "八芳園MuSuBu 福島県鏡石町 鏡石いちごフェア",
            "八芳園MuSuBu 福岡県北九州市フェア",
            "八芳園MuSuBu 沖縄イベント",
            "八芳園MuSuBu 福島県南会津町イベント",
            "八芳園MuSuBu 東京11の島物語",
            "八芳園MuSuBu 南房総festival",
            "FOODEX フローズン・オブ・フューチャー 美食女子",
            "パナソニック AR体験ブース",
            "YouTube エキテンチャンネル",
            "PDCサイネージ紹介映像",
        ],
    )

    subsection(pdf, "コンテスト・TV・モデル 他")
    subsubsection(pdf, "■ コンテスト")
    bullet_list(pdf, ["ミスインターナショナルジャパン2019 ファイナリスト"])
    subsubsection(pdf, "■ TV")
    bullet_list(
        pdf,
        [
            "テレビ東京「電波独占！Matt様のお買い物」ヘアモデル",
            "NTV 行列のできる法律相談所 再現VTR",
            "TBS 名医のTHE太鼓判! 再現VTR",
        ],
    )
    subsubsection(pdf, "■ 舞台")
    bullet_list(
        pdf,
        [
            "ミュージカル「赤い鳥」主演",
            "エアースタジオ「GIFT」",
            "エアースタジオ「声なき声」",
            "劇団伸軟骨「鈍色の森」",
        ],
    )
    subsubsection(pdf, "■ モデル（雑誌・カタログ）")
    bullet_list(
        pdf,
        ["健康365", "ベストカー2019", "トムス（株）カタログ", "造形社 Girls Biker", "造形社 motocoto", "など他多数"],
    )
    subsubsection(pdf, "■ WEB")
    bullet_list(
        pdf,
        [
            "アプロス株式会社 泡立つホワイトパック イメージモデル",
            "NHK技研「NHK8Kイベント」モデル",
            "八芳園オンライン配信スタジオ「KOUTEN」PV",
            "肌ナチュール 炭酸ホットクレンジング紹介動画 CM",
            "運送会社 LSE様 創立60周年パーティー ステージモデル",
            "女性専用セルフ脱毛サロン「コンビニ脱毛MyTime」紹介動画",
            "CEPホールディングス(株) サロンモデル",
            "Jewelna Rose 通勤バッグ特集スナップ企画モデル",
            "株式会社MONOPIA バッグ ECサイトモデル",
            "ブランドサイト「VR・360動画制作サービス ぐるりVR」イメージモデル",
            "YOSHIDA GYM 紹介動画",
            "株式会社B-style キャンピングカー紹介動画",
            "イオンモール ウォーキングモデル",
            "ホンダ地所 CM",
            "占いサービス MIROR 広告",
            "デーティングアプリ Dine 紹介動画",
            "大手マッチングアプリ運営 オンライン結婚相談所 WEB広告用モデル",
            "婚活・結婚おうえんネット 広告",
        ],
    )
    subsubsection(pdf, "■ スチール・ポスター")
    bullet_list(pdf, ["日本二輪車普及安全協会「交通安全啓発キャンペーン」"])

    section_title(pdf, "Contact", "お問い合わせ")
    body_text(pdf, "お仕事のご依頼やメッセージは、各SNSのDMよりお待ちしております。")
    body_text(pdf, "Instagram：@kojima_ruka")
    body_text(pdf, "X (Twitter)：@kojiruka")

    pdf.ln(4)
    pdf.set_font("JP", size=7.5)
    pdf.set_text_color(136, 136, 136)
    pdf.multi_cell(
        0,
        4.5,
        "本資料は公式プロフィールサイト（https://ruka-kojima-mc-profile.vercel.app）の内容をまとめたものです。"
        "宣材写真はサイト上でご確認いただけます。© 2026 Ruka Kojima",
    )

    pdf.output(str(OUTPUT))
    import shutil
    shutil.copy2(OUTPUT, OUTPUT_ASCII)
    print(f"Created: {OUTPUT}")
    print(f"Copy:    {OUTPUT_ASCII}")


if __name__ == "__main__":
    build_pdf()
