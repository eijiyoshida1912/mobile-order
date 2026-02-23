import { items } from "../../data/items";
import { Box, Button, Modal, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import style from "./menu.module.scss"
import NumberSpinner from "../../components/numberSpinner/NumberSpinner";
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { fetchSuggestions } from "../../api/ai";
import type { SuggestMode, Suggestion } from "../../api/ai";
import aiBanner from "../../images/ai_banner.png"
import { useCart } from "../../contexts/CartContext";
import { useUI } from "../../contexts/UIContext";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function MenuPage() {
  const { openCart } = useUI();
  const [value, setValue] = useState(0);
  const { toast } = useUI();
  const handleAddToCart = (id: string) => {
    inc(id);
    toast("カートに追加しました！");
  };
  // 追加：カート
  const { cart, inc, dec } = useCart();
  const getCount = (id: string) => cart[id] ?? 0;

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const aiSuggestOrderButton = () => {
    openCart();
    setAiSuggestModalOpen(false);
  }

  const [summary, setSummary] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<SuggestMode | null>(null);

  const [aiSuggestModalOpen, setAiSuggestModalOpen] = useState(false);
  const handleAiSuggestModalOpen = () => setAiSuggestModalOpen(true);
  const handleAiSuggestModalClose = () => setAiSuggestModalOpen(false);
  const [aiLoadingModalOpen, setAiLoadingModalOpen] = useState(false);
  const handleAiLoadingModalOpen = () => setAiLoadingModalOpen(true);
  const handleAiLoadingModalClose = () => setAiLoadingModalOpen(false);

  const onAiSuggest = async (mode: SuggestMode) => {
    setLoading(true);
    handleAiLoadingModalOpen();
    setActiveMode(mode);
    try {
      const data = await fetchSuggestions(items, cart, mode);
      setSummary(data.summary);
      setSuggestions(data.suggestions);
      handleAiSuggestModalOpen();
      console.log(data.suggestions);

    } catch (e) {
      // snackbarとかでエラー表示してもいい
    } finally {
      setLoading(false);
      handleAiLoadingModalClose();
    }
  };

  // 商品詳細 --------------
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState("");
  const openDetail = (id: string) => {
    setSelectedDetailId(id);
    setDetailOpen(true);
  }
  const selectedItem = items.find(item => item.id === selectedDetailId);

  return (
    <>
      <div>
        <div className={style.header}>
          <h1>メニュー</h1>
        </div>
        <div className={style.contents}>

          <div className={style.topAiSuggest}>
            <img src={aiBanner} alt="AIがおすすめします！" className={style.aiBanner} />
            <div className={style.aiBannerTextWrap}>
              <h2 className={style.aiBannerText}>いまどんな気分？</h2>
            </div>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <Button variant="contained" disabled={loading} onClick={() => onAiSuggest("thirsty")}>
                喉が<br />渇いた
              </Button>
              <Button variant="contained" disabled={loading} onClick={() => onAiSuggest("hungry")}>
                お腹<br />すいた
              </Button>
              <Button variant="contained" disabled={loading} onClick={() => onAiSuggest("drink_all_night")}>
                とことん <br />飲みたい
              </Button>
            </Box>
          </div>

          <Modal
            open={aiLoadingModalOpen}
            onClose={handleAiLoadingModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className={style.aiLoadingModal}>
              <p>AIが考え中...</p>
            </div>
          </Modal>


          <Modal
            open={aiSuggestModalOpen}
            onClose={handleAiSuggestModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >

            <div className={style.aiSuggestModal}>
              <h3 className={style.title}>
                AIおすすめ{activeMode === "thirsty" ? "（喉が渇いた）"
                  : activeMode === "hungry" ? "（お腹すいた）"
                    : "（とことん飲みたい）"}
              </h3>
              {summary && (
                <p className={style.aiSummary}>
                  {summary}
                </p>
              )}
              <ul>
                {suggestions.map(s => {
                  const item = items.find(i => i.id === s.id);
                  if (!item) return null;
                  return (
                    <li key={s.id} className={style.aiSuggestList}>
                      <div className={style.aiText}>
                        <p className={style.name}>{item.name}</p>
                        <p className={style.reason}>{s.reason}</p>
                      </div>
                      <div className={style.aiSpinner}>
                        <NumberSpinner
                          value={getCount(item.id)}
                          onInc={() => handleAddToCart(item.id)}
                          onDec={() => dec(item.id)}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* 一括追加ボタン */}
              <Button
                variant="contained"
                onClick={() => suggestions.forEach(s => handleAddToCart(s.id))}
                disabled={suggestions.length === 0}
                className={style.addAllButton}
              >
                ぜんぶ追加する
              </Button>
              <Button
                variant="contained"
                onClick={() => aiSuggestOrderButton()}
                className={style.orderButton}
              >
                カートにすすむ
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleAiSuggestModalClose()}
                className={style.modalCloseButton}
              >
                閉じる
              </Button>
            </div>
          </Modal>


          <Box sx={{ borderBottom: 1, borderColor: 'divider', position: "sticky", top: 0, background: "#faf7f2", zIndex: 1300 }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth">
              <Tab label="ドリンク" {...a11yProps(0)} />
              <Tab label="フード" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <ul className={style.list}>
              {items.filter((item) => item.type === "drink").map((item) => (
                <li key={item.id} className={style.listItem}>
                  <img className={style.image} src={item.image} alt={item.name} />
                  <div className={style.textWrap}>
                    <p className={style.name}>{item.name}</p>
                    <div className={style.priceWrap}>
                      <p className={style.price}><small className={style.yenMark}>¥</small>{item.price}</p>
                      <button className={style.openDetailButton} onClick={() => openDetail(item.id)}><InfoOutlineIcon /></button>
                    </div>
                  </div>
                  <div className={style.buttonWrap}>
                    <NumberSpinner
                      value={getCount(item.id)}
                      onInc={() => handleAddToCart(item.id)}
                      onDec={() => dec(item.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <ul className={style.list}>
              {items.filter((item) => item.type === "food").map((item) => (
                <li key={item.id} className={style.listItem}>
                  <img className={style.image} src={item.image} alt={item.name} />
                  <div className={style.textWrap}>
                    <p className={style.name}>{item.name}</p>
                    <div className={style.priceWrap}>
                      <p className={style.price}>¥{item.price}</p>
                      <button className={style.openDetailButton} onClick={() => openDetail(item.id)}><InfoOutlineIcon /></button>
                    </div>
                  </div>
                  <div className={style.buttonWrap}>
                    <NumberSpinner
                      value={getCount(item.id)}
                      onInc={() => handleAddToCart(item.id)}
                      onDec={() => dec(item.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </CustomTabPanel>
        </div>

      </div>

      {/* 商品詳細 */}
      <div
        className={`${style.detail} ${detailOpen ? style.active : ""
          }`}>
        <h2 className={style.title}>商品詳細</h2>
        {selectedItem ? (
          <>
            <img src={selectedItem.image} alt={selectedItem.name} className={style.image} />

            <div className={style.detailWrap}>
              <h3 className={style.name}>{selectedItem.name}</h3>
              <NumberSpinner
                value={getCount(selectedItem.id)}
                onInc={() => handleAddToCart(selectedItem.id)}
                onDec={() => dec(selectedItem.id)}
              />
            </div>

            <p className={style.desc}>{selectedItem.desc}</p>

            <Button
              variant="contained"
              onClick={() => aiSuggestOrderButton()}
              className={style.toCartButton}
            >
              カートに進む
            </Button>
          </>
        ) : (
          <p className={style.notFound}>商品が見つかりません</p>
        )}
        <Button
          variant="outlined"
          className={style.backButton}
          onClick={() => setDetailOpen(false)}
        >戻る</Button>
      </div>
    </>
  );
}
