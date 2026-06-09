// src/screens/MarketScreen.tsx
// ZimAgroMarket — MDUMENI's full agricultural marketplace
// Live prices · Farmer listings · Buyer demand · Input prices
// Post listings · Deal confirmation · Price alerts · SMS broadcast

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, TextInput, Modal, Alert, ActivityIndicator,
  RefreshControl, Dimensions, Image, Linking,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import {
  getListings, getMyListings, createListing, updateListing,
  deleteListing, confirmDeal, createPriceAlert, boostListing,
  getSuggestedPrice, saveDraft, flushDrafts,
  MarketplaceListing, ListingType,
} from '@/services/marketplaceApi';

const BASE_URL = 'https://mdumeni-api.onrender.com';

const G = '#1A5C2A';
const G_LIGHT = '#EAF3DE';
const AMBER = '#EF9F27';
const AMBER_LIGHT = '#FFF8E7';
const BLUE = '#1A4C8C';
const BLUE_LIGHT = '#EBF0FB';
const RED = '#C0392B';
const RED_LIGHT = '#FDECEA';

const CROPS = [
  'Maize','Sugar beans','Groundnuts','Soybeans','Sorghum','Sunflower',
  'Cotton','Tobacco','Cowpeas','Sweet potato','Tomatoes','Potatoes',
  'Coffee','Macadamia','Sesame','Sugar cane','Wheat','Barley',
];

const PROVINCES = [
  'Harare','Mashonaland East','Mashonaland West','Mashonaland Central',
  'Manicaland','Midlands','Masvingo','Matabeleland North',
  'Matabeleland South','Bulawayo',
];

const QUALITY_LABELS: Record<string,string> = { A:'Grade A', B:'Grade B', standard:'Standard' };
const TYPE_COLORS: Record<string,string>    = { selling:G, buying:BLUE, input:AMBER };
const TYPE_BG:     Record<string,string>    = { selling:G_LIGHT, buying:BLUE_LIGHT, input:AMBER_LIGHT };
const TYPE_ICONS:  Record<string,string>    = { selling:'🌱', buying:'🛒', input:'🧴' };
const TYPE_LABELS: Record<string,string>    = { selling:'Selling', buying:'Buying', input:'Inputs' };

type MarketTab  = 'prices'|'selling'|'buying'|'inputs'|'mine';
type ModalType  = 'post'|'detail'|'deal'|'alert'|null;

function freshness(dateStr: string): { label:string; color:string } {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600)  return { label:`${Math.floor(diff/60)}m ago`,  color:G };
  if (diff < 86400) return { label:`${Math.floor(diff/3600)}h ago`,color:G };
  const days = Math.floor(diff/86400);
  if (days >= 6)    return { label:`${days}d — expiring`,           color:RED };
  if (days >= 2)    return { label:`${days}d ago`,                  color:AMBER };
  return { label:'Yesterday', color:AMBER };
}

function VerifiedBadge() {
  return <View style={c.verifiedBadge}><Text style={c.verifiedText}>✅ Verified</Text></View>;
}
function ProBadge() {
  return <View style={c.proBadge}><Text style={c.proText}>⭐ Pro</Text></View>;
}

// ── Listing card ───────────────────────────────────────────
function ListingCard({ item, onPress, onCall }: {
  item: MarketplaceListing; onPress: ()=>void; onCall: ()=>void;
}) {
  const f = freshness(item.created_at);
  const tc = TYPE_COLORS[item.type] ?? G;
  const tb = TYPE_BG[item.type] ?? G_LIGHT;
  return (
    <TouchableOpacity style={[c.card, item.is_boosted && c.cardBoosted]} onPress={onPress} activeOpacity={0.85}>
      {item.is_boosted && (
        <View style={c.boostedBanner}>
          <Text style={c.boostedText}>📌 Featured listing</Text>
        </View>
      )}
      <View style={c.cardTop}>
        <View style={c.cardPhoto}>
          {item.photo_url
            ? <Image source={{ uri:item.photo_url }} style={c.cardPhotoImg} resizeMode="cover" />
            : <View style={[c.cardPhotoPlaceholder,{backgroundColor:tb}]}>
                <Text style={{fontSize:24}}>{TYPE_ICONS[item.type]}</Text>
              </View>
          }
        </View>
        <View style={{flex:1,marginLeft:12}}>
          <View style={c.cardTitleRow}>
            <Text style={c.cardCrop} numberOfLines={1}>{item.crop_name}</Text>
            <Text style={[c.freshLabel,{color:f.color}]}>{f.label}</Text>
          </View>
          <View style={c.cardBadgeRow}>
            <View style={[c.typePill,{backgroundColor:tb}]}>
              <Text style={[c.typePillText,{color:tc}]}>{TYPE_LABELS[item.type]}</Text>
            </View>
            <View style={c.gradePill}>
              <Text style={c.gradeText}>{QUALITY_LABELS[item.quality_grade]??item.quality_grade}</Text>
            </View>
            {item.is_verified_seller && <VerifiedBadge />}
            {item.is_pro && <ProBadge />}
          </View>
          <Text style={c.cardLocation}>📍 {item.district}, {item.province}</Text>
          <View style={c.cardPriceRow}>
            <View>
              <Text style={[c.cardPrice,{color:tc}]}>${item.price_usd_kg.toFixed(2)}/kg</Text>
              <Text style={c.cardQty}>
                {item.quantity_bags
                  ? `${item.quantity_bags} bags (${item.quantity_kg.toLocaleString()} kg)`
                  : `${item.quantity_kg.toLocaleString()} kg`}
              </Text>
            </View>
            <TouchableOpacity style={[c.callBtn,{backgroundColor:tc}]} onPress={onCall}>
              <Text style={c.callBtnText}>📞 Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {item.description
        ? <Text style={c.cardDesc} numberOfLines={2}>{item.description}</Text>
        : null}
      <View style={c.cardFooter}>
        <Text style={c.cardSeller}>{item.farmer_name}</Text>
        {item.deal_count > 0 &&
          <Text style={c.dealCount}>{item.deal_count} deal{item.deal_count>1?'s':''} done</Text>}
      </View>
    </TouchableOpacity>
  );
}

function PriceRow({item}:{item:any}) {
  const trend = item.trend ?? 'flat';
  const arrow = trend==='up'?'↑':trend==='down'?'↓':'—';
  const tColor = trend==='up'?G:trend==='down'?RED:Colors.slate400;
  return (
    <View style={c.priceRow}>
      <View style={{flex:1}}>
        <Text style={c.priceCrop}>{item.crop_name}</Text>
        <Text style={c.priceMarket}>{item.market_name??item.market_id} · {item.quality_grade}</Text>
      </View>
      <View style={{alignItems:'flex-end'}}>
        <Text style={c.priceVal}>${parseFloat(item.price_usd_kg).toFixed(2)}/kg</Text>
        <Text style={[c.priceTrend,{color:tColor}]}>{arrow}</Text>
      </View>
    </View>
  );
}

// ── Post listing modal (3 steps) ──────────────────────────
function PostListingModal({visible,onClose,onSuccess,initialType}:{
  visible:boolean; onClose:()=>void; onSuccess:()=>void; initialType?:ListingType;
}) {
  const profile    = useAppStore(s=>s.profile);
  const isOnline   = useAppStore(s=>s.isOnline);
  const farmerId   = useAppStore(s=>s.farmerId);
  const isDemoMode = useAppStore(s=>s.isDemoMode);
  const [step,setStep]             = useState(1);
  const [type,setType]             = useState<ListingType>(initialType??'selling');
  const [cropName,setCropName]     = useState('');
  const [quantity,setQuantity]     = useState('');
  const [inBags,setInBags]         = useState(false);
  const [grade,setGrade]           = useState<'A'|'B'|'standard'>('standard');
  const [price,setPrice]           = useState('');
  const [suggestedPrice,setSugg]   = useState<number|null>(null);
  const [province,setProvince]     = useState(profile?.province??'');
  const [district,setDistrict]     = useState(profile?.district??'');
  const [phone,setPhone]           = useState('');
  const [description,setDesc]      = useState('');
  const [broadcast,setBroadcast]   = useState(true);
  const [availableFrom,setAvFrom]  = useState('');
  const [loading,setLoading]       = useState(false);
  const [showCropPicker,setShowCP] = useState(false);
  const [showProvPicker,setShowPP] = useState(false);

  useEffect(()=>{ if(visible){setStep(1);} if(initialType) setType(initialType); },[visible,initialType]);
  useEffect(()=>{ if(cropName&&province) getSuggestedPrice(cropName,province).then(setSugg); },[cropName,province]);

  const qtyKg = inBags ? parseFloat(quantity||'0')*90 : parseFloat(quantity||'0');
  const tc = TYPE_COLORS[type];

  const submit = async () => {
    if(!cropName||!quantity||!price||!phone){Alert.alert('Missing info','Fill all required fields.');return;}
    setLoading(true);
    const listing = {
      type, crop_name:cropName,
      quantity_kg:qtyKg, quantity_bags:inBags?parseFloat(quantity):undefined,
      price_usd_kg:parseFloat(price), quality_grade:grade,
      province, district, phone,
      farmer_name: profile?.district?`${profile.district} Farm`:'MDUMENI Farmer',
      farmer_id: (!isDemoMode && farmerId) ? farmerId : undefined,
      description, broadcast, available_from:availableFrom||undefined,
    };
    if(!isOnline){ void saveDraft(listing); Alert.alert('Saved offline','Posts when you reconnect.'); setLoading(false); onSuccess(); return; }
    const result = await createListing(listing);
    setLoading(false);
    if(result.success){ onSuccess(); Alert.alert('✅ Posted!', broadcast?'Listing live. SMS sent to district.':'Listing live on ZimAgroMarket.'); }
    else Alert.alert('Error', result.error??'Could not post. Try again.');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}>
        <View style={mp.container}>
          <View style={[mp.header,{backgroundColor:tc}]}>
            <TouchableOpacity onPress={onClose} style={mp.closeBtn}>
              <Text style={mp.closeTxt}>✕</Text>
            </TouchableOpacity>
            <Text style={mp.headerTitle}>Post a listing</Text>
            <Text style={mp.headerSub}>Step {step} of 3</Text>
            <View style={mp.stepDots}>
              {[1,2,3].map(i=><View key={i} style={[mp.dot, step>=i&&mp.dotActive]}/>)}
            </View>
          </View>

          <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,gap:16}}>

            {step===1 && <>
              <Text style={mp.label}>I am posting a...</Text>
              <View style={mp.typeGrid}>
                {(['selling','buying','input'] as ListingType[]).map(t=>(
                  <TouchableOpacity key={t}
                    style={[mp.typeCard, type===t&&{borderColor:TYPE_COLORS[t],backgroundColor:TYPE_BG[t]}]}
                    onPress={()=>setType(t)}>
                    <Text style={{fontSize:22,marginBottom:5}}>{TYPE_ICONS[t]}</Text>
                    <Text style={[mp.typeTitle, type===t&&{color:TYPE_COLORS[t]}]}>
                      {t==='selling'?'Crop for sale':t==='buying'?'Buying crops':'Input/Supply'}
                    </Text>
                    <Text style={mp.typeDesc}>
                      {t==='selling'?'I have crops to sell':t==='buying'?'I want to buy crops':'I sell inputs'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={mp.label}>Crop / product *</Text>
              <TouchableOpacity style={mp.input} onPress={()=>setShowCP(!showCropPicker)}>
                <Text style={cropName?mp.inputText:mp.inputPh}>{cropName||'Select crop...'}</Text>
              </TouchableOpacity>
              {showCropPicker&&<View style={mp.picker}>
                <ScrollView style={{maxHeight:180}}>
                  {CROPS.map(cr=>(
                    <TouchableOpacity key={cr} style={mp.pickerOpt} onPress={()=>{setCropName(cr);setShowCP(false);}}>
                      <Text style={mp.pickerOptText}>{cr}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>}

              <Text style={mp.label}>Quality grade *</Text>
              <View style={mp.gradeRow}>
                {(['A','B','standard'] as const).map(g=>(
                  <TouchableOpacity key={g} style={[mp.gradeBtn, grade===g&&{backgroundColor:tc,borderColor:tc}]}
                    onPress={()=>setGrade(g)}>
                    <Text style={[mp.gradeBtnText, grade===g&&{color:'white'}]}>{QUALITY_LABELS[g]}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={mp.label}>Description (optional)</Text>
              <TextInput style={[mp.input,{height:68,textAlignVertical:'top'}]}
                placeholder="e.g. Dry, clean, ready for export" value={description} onChangeText={setDesc} multiline/>
            </>}

            {step===2 && <>
              <Text style={mp.label}>Quantity *</Text>
              <View style={{flexDirection:'row',gap:8}}>
                <TextInput style={[mp.input,{flex:1}]}
                  placeholder={inBags?'Number of bags':'Kilograms'}
                  value={quantity} onChangeText={setQuantity} keyboardType="numeric"/>
                <TouchableOpacity style={[mp.unitBtn,!inBags&&{backgroundColor:tc,borderColor:tc}]}
                  onPress={()=>setInBags(false)}>
                  <Text style={[mp.unitBtnText,!inBags&&{color:'white'}]}>kg</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[mp.unitBtn,inBags&&{backgroundColor:tc,borderColor:tc}]}
                  onPress={()=>setInBags(true)}>
                  <Text style={[mp.unitBtnText,inBags&&{color:'white'}]}>bags</Text>
                </TouchableOpacity>
              </View>
              {inBags&&quantity&&<Text style={mp.conv}>= {(parseFloat(quantity)*90).toFixed(0)} kg (90 kg/bag)</Text>}

              <Text style={mp.label}>{type==='buying'?'Offering':'Asking'} price (USD/kg) *</Text>
              {suggestedPrice&&<TouchableOpacity style={mp.suggChip} onPress={()=>setPrice(suggestedPrice.toFixed(2))}>
                <Text style={mp.suggText}>💡 Market rate: ${suggestedPrice.toFixed(2)}/kg — tap to use</Text>
              </TouchableOpacity>}
              <TextInput style={mp.input} placeholder="e.g. 0.83"
                value={price} onChangeText={setPrice} keyboardType="decimal-pad"/>

              {quantity&&price&&<View style={mp.totalCard}>
                <Text style={mp.totalLabel}>Estimated total value</Text>
                <Text style={[mp.totalVal,{color:tc}]}>
                  ${(qtyKg*parseFloat(price||'0')).toFixed(0)}
                </Text>
                <Text style={mp.totalNote}>{qtyKg.toLocaleString()} kg × ${parseFloat(price||'0').toFixed(2)}/kg</Text>
              </View>}

              <Text style={mp.label}>Available from (optional)</Text>
              <TextInput style={mp.input} placeholder="e.g. This Saturday / 2026-08-15"
                value={availableFrom} onChangeText={setAvFrom}/>
            </>}

            {step===3 && <>
              <Text style={mp.label}>Province *</Text>
              <TouchableOpacity style={mp.input} onPress={()=>setShowPP(!showProvPicker)}>
                <Text style={province?mp.inputText:mp.inputPh}>{province||'Select province...'}</Text>
              </TouchableOpacity>
              {showProvPicker&&<View style={mp.picker}>
                <ScrollView style={{maxHeight:160}}>
                  {PROVINCES.map(pv=>(
                    <TouchableOpacity key={pv} style={mp.pickerOpt} onPress={()=>{setProvince(pv);setShowPP(false);}}>
                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={mp.pickerOptText}>{pv}</Text>
                        {province===pv&&<Text style={{color:G}}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>}

              <Text style={mp.label}>District *</Text>
              <TextInput style={mp.input} placeholder="e.g. Marondera"
                value={district} onChangeText={setDistrict}/>

              <Text style={mp.label}>Contact phone *</Text>
              <TextInput style={mp.input} placeholder="+263 77 000 0000"
                value={phone} onChangeText={setPhone} keyboardType="phone-pad"/>

              <TouchableOpacity style={[mp.broadcastCard, broadcast&&{borderColor:tc,backgroundColor:TYPE_BG[type]}]}
                onPress={()=>setBroadcast(!broadcast)}>
                <View style={{flex:1}}>
                  <Text style={mp.bcTitle}>📱 SMS broadcast</Text>
                  <Text style={mp.bcDesc}>
                    {type==='buying'
                      ?'Alert farmers in your district who grow this crop — even without the app'
                      :'Notify buyers in your district about your listing'}
                  </Text>
                  <Text style={mp.bcNote}>First broadcast free · Additional: $0.20</Text>
                </View>
                <View style={[mp.toggle, broadcast&&{backgroundColor:tc}]}>
                  <View style={[mp.toggleThumb, broadcast&&mp.toggleThumbOn]}/>
                </View>
              </TouchableOpacity>

              {!isOnline&&<View style={mp.offlineNote}>
                <Text style={mp.offlineNoteText}>📡 Offline — listing saves and posts when you reconnect.</Text>
              </View>}
            </>}

          </ScrollView>

          <View style={mp.footer}>
            {step>1&&<TouchableOpacity style={mp.backBtn} onPress={()=>setStep(s=>s-1)}>
              <Text style={mp.backBtnText}>← Back</Text>
            </TouchableOpacity>}
            {step<3
              ?<TouchableOpacity style={[mp.nextBtn,{backgroundColor:tc,flex:step>1?1:undefined,marginLeft:step>1?10:0}]}
                  onPress={()=>setStep(s=>s+1)}>
                  <Text style={mp.nextBtnText}>Next →</Text>
                </TouchableOpacity>
              :<TouchableOpacity style={[mp.nextBtn,{backgroundColor:tc,flex:1,marginLeft:10}]}
                  onPress={submit} disabled={loading}>
                  {loading?<ActivityIndicator color="white"/>:<Text style={mp.nextBtnText}>Post listing ✓</Text>}
                </TouchableOpacity>
            }
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Listing detail modal ───────────────────────────────────
function ListingDetailModal({item,visible,onClose,onDeal}:{
  item:MarketplaceListing|null; visible:boolean; onClose:()=>void; onDeal:()=>void;
}) {
  if(!item) return null;
  const tc = TYPE_COLORS[item.type];
  const f  = freshness(item.created_at);
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={{flex:1,backgroundColor:Colors.background}}>
        <View style={[md.header,{backgroundColor:tc}]}>
          <TouchableOpacity onPress={onClose}><Text style={md.closeTxt}>✕ Close</Text></TouchableOpacity>
          <Text style={md.headerTitle}>{item.crop_name}</Text>
          <Text style={md.headerSub}>{TYPE_LABELS[item.type]} · {f.label}</Text>
        </View>
        <ScrollView contentContainerStyle={{padding:20,gap:14}}>
          {item.photo_url&&<Image source={{uri:item.photo_url}} style={md.photo} resizeMode="cover"/>}

          <View style={md.badgeRow}>
            <View style={[md.badge,{backgroundColor:TYPE_BG[item.type]}]}>
              <Text style={[md.badgeText,{color:tc}]}>{TYPE_LABELS[item.type]}</Text>
            </View>
            <View style={md.badge}><Text style={md.badgeText}>{QUALITY_LABELS[item.quality_grade]}</Text></View>
            {item.is_verified_seller&&<VerifiedBadge/>}
          </View>

          <View style={md.priceCard}>
            <View style={{flex:1}}>
              <Text style={md.priceLabel}>Price</Text>
              <Text style={[md.priceVal,{color:tc}]}>${item.price_usd_kg.toFixed(2)}/kg</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={md.priceLabel}>Quantity</Text>
              <Text style={md.priceQty}>{item.quantity_bags?`${item.quantity_bags} bags`:`${item.quantity_kg.toLocaleString()} kg`}</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={md.priceLabel}>Total value</Text>
              <Text style={[md.priceVal,{color:tc}]}>${(item.quantity_kg*item.price_usd_kg).toFixed(0)}</Text>
            </View>
          </View>

          <View style={md.sellerCard}>
            <Text style={md.sellerName}>{item.farmer_name}</Text>
            {item.deal_count>0&&<Text style={md.sellerDeals}>{item.deal_count} completed deal{item.deal_count>1?'s':''}</Text>}
            <Text style={md.sellerLoc}>📍 {item.district}, {item.province}</Text>
            {item.available_from&&<Text style={md.sellerLoc}>📅 Available: {item.available_from}</Text>}
          </View>

          {item.description&&<View style={md.descCard}>
            <Text style={md.descLabel}>Details</Text>
            <Text style={md.descText}>{item.description}</Text>
          </View>}

          <TouchableOpacity style={[md.callBtn,{backgroundColor:tc}]}
            onPress={()=>Linking.openURL(`tel:${item.phone}`)}>
            <Text style={md.callBtnText}>📞 Call {item.farmer_name} · {item.phone}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={md.dealBtn} onPress={onDeal}>
            <Text style={md.dealBtnText}>🤝 I want this — confirm deal</Text>
          </TouchableOpacity>
          <Text style={md.dealNote}>Confirming a deal builds your verified seller reputation.</Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Deal modal ─────────────────────────────────────────────
function DealModal({item,visible,onClose,onConfirmed}:{
  item:MarketplaceListing|null; visible:boolean; onClose:()=>void; onConfirmed:()=>void;
}) {
  const [buyerName,setBuyerName] = useState('');
  const [buyerPhone,setBuyerPhone] = useState('');
  const [qty,setQty]             = useState('');
  const [agreedPrice,setAP]      = useState('');
  const [paid,setPaid]           = useState(false);
  const [rating,setRating]       = useState<'up'|'down'|null>(null);
  const [loading,setLoading]     = useState(false);
  if(!item) return null;
  const submit = async()=>{
    if(!buyerName||!buyerPhone){Alert.alert('Fill buyer details');return;}
    setLoading(true);
    const ok = await confirmDeal({
      listing_id:item.id, buyer_name:buyerName, buyer_phone:buyerPhone,
      quantity_kg:parseFloat(qty)||item.quantity_kg,
      agreed_price:parseFloat(agreedPrice)||item.price_usd_kg,
      buyer_paid:paid, seller_confirmed:false, buyer_rating:rating??undefined,
    });
    setLoading(false);
    if(ok){ onConfirmed(); Alert.alert('Deal recorded!','Seller notified. Confirm when payment complete.'); }
    else Alert.alert('Error','Could not record deal.');
  };
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet">
      <View style={{flex:1,backgroundColor:Colors.background}}>
        <View style={[md.header,{backgroundColor:G}]}>
          <TouchableOpacity onPress={onClose}><Text style={md.closeTxt}>✕</Text></TouchableOpacity>
          <Text style={md.headerTitle}>Confirm deal</Text>
          <Text style={md.headerSub}>{item.crop_name} · {item.farmer_name}</Text>
        </View>
        <ScrollView contentContainerStyle={{padding:20,gap:14}}>
          <TextInput style={mp.input} placeholder="Your name *" value={buyerName} onChangeText={setBuyerName}/>
          <TextInput style={mp.input} placeholder="Your phone *" value={buyerPhone} onChangeText={setBuyerPhone} keyboardType="phone-pad"/>
          <TextInput style={mp.input} placeholder={`Quantity kg (default: ${item.quantity_kg})`} value={qty} onChangeText={setQty} keyboardType="numeric"/>
          <TextInput style={mp.input} placeholder={`Agreed price (default: $${item.price_usd_kg}/kg)`} value={agreedPrice} onChangeText={setAP} keyboardType="decimal-pad"/>
          <TouchableOpacity style={[mp.broadcastCard,paid&&{borderColor:G,backgroundColor:G_LIGHT}]}
            onPress={()=>setPaid(!paid)}>
            <View style={{flex:1}}>
              <Text style={mp.bcTitle}>💸 Mark as paid</Text>
              <Text style={mp.bcDesc}>I have paid the seller for this crop</Text>
            </View>
            <View style={[mp.toggle,paid&&{backgroundColor:G}]}>
              <View style={[mp.toggleThumb,paid&&mp.toggleThumbOn]}/>
            </View>
          </TouchableOpacity>
          <Text style={mp.label}>Rate this seller</Text>
          <View style={{flexDirection:'row',gap:12}}>
            <TouchableOpacity style={[mp.gradeBtn,rating==='up'&&{backgroundColor:G,borderColor:G}]} onPress={()=>setRating('up')}>
              <Text style={[mp.gradeBtnText,rating==='up'&&{color:'white'}]}>👍 Good</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[mp.gradeBtn,rating==='down'&&{backgroundColor:RED,borderColor:RED}]} onPress={()=>setRating('down')}>
              <Text style={[mp.gradeBtnText,rating==='down'&&{color:'white'}]}>👎 Issue</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[mp.nextBtn,{backgroundColor:G}]} onPress={submit} disabled={loading}>
            {loading?<ActivityIndicator color="white"/>:<Text style={mp.nextBtnText}>Confirm deal</Text>}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Price alert modal ──────────────────────────────────────
function PriceAlertModal({visible,onClose}:{visible:boolean;onClose:()=>void}) {
  const profile  = useAppStore(s=>s.profile);
  const farmerId = useAppStore(s=>s.farmerId);
  const [crop,setCrop]           = useState('');
  const [target,setTarget]       = useState('');
  const [alertType,setAlertType] = useState<'above'|'below'>('above');
  const [loading,setLoading]     = useState(false);
  const [showCP,setShowCP]       = useState(false);
  const submit = async()=>{
    if(!crop||!target){Alert.alert('Fill all fields');return;}
    setLoading(true);
    const ok = await createPriceAlert({crop_name:crop,target_price:parseFloat(target),province:profile?.province??'',type:alertType,farmer_id:farmerId??'demo'});
    setLoading(false);
    if(ok){onClose();Alert.alert('Alert set!',`Notify when ${crop} is ${alertType} $${target}/kg`);}
  };
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet">
      <View style={{flex:1,backgroundColor:Colors.background}}>
        <View style={[md.header,{backgroundColor:AMBER}]}>
          <TouchableOpacity onPress={onClose}><Text style={md.closeTxt}>✕</Text></TouchableOpacity>
          <Text style={md.headerTitle}>Price alert</Text>
          <Text style={md.headerSub}>Get notified when prices change</Text>
        </View>
        <ScrollView contentContainerStyle={{padding:20,gap:14}}>
          <Text style={mp.label}>Crop</Text>
          <TouchableOpacity style={mp.input} onPress={()=>setShowCP(!showCP)}>
            <Text style={crop?mp.inputText:mp.inputPh}>{crop||'Select crop...'}</Text>
          </TouchableOpacity>
          {showCP&&<View style={mp.picker}>
            <ScrollView style={{maxHeight:160}}>
              {CROPS.map(cr=>(
                <TouchableOpacity key={cr} style={mp.pickerOpt} onPress={()=>{setCrop(cr);setShowCP(false);}}>
                  <Text style={mp.pickerOptText}>{cr}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>}
          <Text style={mp.label}>Alert me when price is...</Text>
          <View style={{flexDirection:'row',gap:10}}>
            <TouchableOpacity style={[mp.gradeBtn,alertType==='above'&&{backgroundColor:G,borderColor:G}]} onPress={()=>setAlertType('above')}>
              <Text style={[mp.gradeBtnText,alertType==='above'&&{color:'white'}]}>↑ Above</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[mp.gradeBtn,alertType==='below'&&{backgroundColor:RED,borderColor:RED}]} onPress={()=>setAlertType('below')}>
              <Text style={[mp.gradeBtnText,alertType==='below'&&{color:'white'}]}>↓ Below</Text>
            </TouchableOpacity>
          </View>
          <TextInput style={mp.input} placeholder="Target price (e.g. 0.85)"
            value={target} onChangeText={setTarget} keyboardType="decimal-pad"/>
          <TouchableOpacity style={[mp.nextBtn,{backgroundColor:AMBER}]} onPress={submit} disabled={loading}>
            {loading?<ActivityIndicator color="white"/>:<Text style={mp.nextBtnText}>Set alert 🔔</Text>}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN SCREEN
// ══════════════════════════════════════════════════════════
export function MarketScreen() {
  const insets     = useSafeAreaInsets();
  const profile    = useAppStore(s=>s.profile);
  const isOnline   = useAppStore(s=>s.isOnline);
  const farmerId   = useAppStore(s=>s.farmerId);
  const isDemoMode = useAppStore(s=>s.isDemoMode);

  const [tab,setTab]               = useState<MarketTab>('prices');
  const [listings,setListings]     = useState<MarketplaceListing[]>([]);
  const [myListings,setMyListings] = useState<MarketplaceListing[]>([]);
  const [cropPrices,setCropPrices] = useState<any[]>([]);
  const [inputPrices,setInputPrices]=useState<any[]>([]);
  const [loading,setLoading]       = useState(false);
  const [refreshing,setRefreshing] = useState(false);
  const [search,setSearch]         = useState('');
  const [provinceFilter,setProvF]  = useState(profile?.province??'');
  const [activeModal,setModal]     = useState<ModalType>(null);
  const [selectedItem,setSelItem]  = useState<MarketplaceListing|null>(null);
  const [postType,setPostType]     = useState<ListingType>('selling');
  const [showFilters,setShowF]     = useState(false);

  const province = profile?.province??'';
  const district = profile?.district??'';

  useEffect(()=>{ loadAll(); flushDrafts(); },[]);
  useEffect(()=>{ if(tab!=='prices'&&tab!=='mine') loadListings(); },[tab,provinceFilter,search]);

  const loadAll = async()=>{
    setLoading(true);
    await Promise.all([loadPrices(),loadListings()]);
    setLoading(false);
  };

  const loadPrices = async()=>{
    if(!isOnline) return;
    try {
      const [cRes,iRes] = await Promise.all([
        fetch(`${BASE_URL}/market/prices/crops/best${province?`?province=${encodeURIComponent(province)}`:''}`).then(r=>r.json()),
        fetch(`${BASE_URL}/market/prices/inputs/cheapest${district?`?district=${encodeURIComponent(district)}`:''}`).then(r=>r.json()),
      ]);
      setCropPrices(cRes.prices??[]);
      setInputPrices(iRes.prices??[]);
    } catch {}
  };

  const loadListings = async()=>{
    if(!isOnline) return;
    const type:ListingType|undefined = tab==='selling'?'selling':tab==='buying'?'buying':tab==='inputs'?'input':undefined;
    if(!type) return;
    const data = await getListings({type,province:provinceFilter||undefined,search:search||undefined,boosted_first:true});
    setListings(data);
  };

  const loadMyListings = async()=>{
    // Use the logged-in farmer's real ID. In demo mode (no auth yet) fall
    // back to 'demo_farmer' so the demo still shows something.
    const id = (!isDemoMode && farmerId) ? farmerId : 'demo_farmer';
    const data = await getMyListings(id);
    setMyListings(data);
  };

  const onRefresh = async()=>{ setRefreshing(true); await loadAll(); setRefreshing(false); };

  const filteredListings = listings.filter(l=>{
    if(!search) return true;
    return l.crop_name.toLowerCase().includes(search.toLowerCase())||
           l.farmer_name.toLowerCase().includes(search.toLowerCase())||
           l.district.toLowerCase().includes(search.toLowerCase());
  });

  const openDetail = (item:MarketplaceListing)=>{ setSelItem(item); setModal('detail'); };
  const callItem   = (item:MarketplaceListing)=>Linking.openURL(`tel:${item.phone}`);
  const handlePostSuccess = ()=>{ setModal(null); loadListings(); if(tab==='mine') loadMyListings(); };

  const tabTypeMap:Record<string,ListingType> = { selling:'selling', buying:'buying', inputs:'input' };

  return (
    <View style={[c.screen,{paddingTop:insets.top}]}>

      {/* Header */}
      <View style={c.header}>
        <View style={c.headerTop}>
          <View>
            <Text style={c.eyebrow}>ZimAgroMarket</Text>
            <Text style={c.title}>Market</Text>
          </View>
          <View style={c.headerActions}>
            <TouchableOpacity style={c.alertBtn} onPress={()=>setModal('alert')}>
              <Text style={{fontSize:16}}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={c.postBtn} onPress={()=>{setPostType('selling');setModal('post');}}>
              <Text style={c.postBtnText}>+ Post</Text>
            </TouchableOpacity>
          </View>
        </View>
        {cropPrices.length>0&&(
          <View style={c.ticker}>
            <Text style={c.tickerLabel}>BEST  </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{flexDirection:'row',gap:16}}>
                {cropPrices.slice(0,6).map((p:any,i:number)=>(
                  <Text key={i} style={c.tickerItem}>
                    {p.crop_name} <Text style={c.tickerPrice}>${parseFloat(p.price_usd_kg).toFixed(2)}</Text>
                  </Text>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>

      {/* Tab bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={c.tabBar} contentContainerStyle={{paddingHorizontal:12,gap:6,paddingVertical:8}}>
        {[
          {key:'prices', label:'📊 Prices',  col:G},
          {key:'selling',label:'🌱 Selling', col:G},
          {key:'buying', label:'🛒 Buying',  col:BLUE},
          {key:'inputs', label:'🧴 Inputs',  col:AMBER},
          {key:'mine',   label:'👤 My listings',col:Colors.slate700},
        ].map(t=>(
          <TouchableOpacity key={t.key}
            style={[c.tabChip, tab===t.key&&{backgroundColor:t.col,borderColor:t.col}]}
            onPress={()=>{ setTab(t.key as MarketTab); if(t.key==='mine') loadMyListings(); }}>
            <Text style={[c.tabChipText, tab===t.key&&{color:'white'}]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search bar */}
      {tab!=='prices'&&(
        <View style={c.searchBar}>
          <TextInput style={c.searchInput}
            placeholder="Search crop, seller, district..."
            value={search} onChangeText={t=>{setSearch(t);loadListings();}}
            returnKeyType="search"/>
          <TouchableOpacity style={c.filterBtn} onPress={()=>setShowF(!showFilters)}>
            <Text style={{fontSize:16}}>⚙️</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter panel */}
      {showFilters&&tab!=='prices'&&(
        <View style={c.filterPanel}>
          <Text style={c.filterPanelLabel}>Province</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:6}}>
            <TouchableOpacity style={[c.filterChip,!provinceFilter&&c.filterChipActive]}
              onPress={()=>setProvF('')}>
              <Text style={[c.filterChipText,!provinceFilter&&{color:'white'}]}>All provinces</Text>
            </TouchableOpacity>
            {PROVINCES.map(pv=>(
              <TouchableOpacity key={pv}
                style={[c.filterChip,provinceFilter===pv&&c.filterChipActive]}
                onPress={()=>setProvF(pv)}>
                <Text style={[c.filterChipText,provinceFilter===pv&&{color:'white'}]}>{pv}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Content */}
      {loading&&!refreshing?(
        <View style={c.loadingWrap}>
          <ActivityIndicator size="large" color={G}/>
          <Text style={c.loadingText}>Loading marketplace...</Text>
        </View>
      ):!isOnline?(
        <View style={c.offlineWrap}>
          <Text style={{fontSize:40,marginBottom:12}}>📡</Text>
          <Text style={c.offlineTitle}>You are offline</Text>
          <Text style={c.offlineSub}>Connect to browse. Draft listings post when you reconnect.</Text>
        </View>
      ):(
        <>
          {/* PRICES */}
          {tab==='prices'&&(
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={G}/>}
              contentContainerStyle={{padding:14,gap:10,paddingBottom:24}}>
              <View style={c.sectionHdr}><Text style={c.sectionTitle}>Best crop prices today</Text><Text style={c.sectionSub}>{province||'Zimbabwe'}</Text></View>
              {cropPrices.map((p:any,i:number)=><PriceRow key={i} item={p}/>)}
              <View style={[c.sectionHdr,{marginTop:8}]}><Text style={c.sectionTitle}>Cheapest inputs near you</Text><Text style={c.sectionSub}>{district||province||'Zimbabwe'}</Text></View>
              {inputPrices.map((p:any,i:number)=>(
                <View key={i} style={c.priceRow}>
                  <View style={{flex:1}}>
                    <Text style={c.priceCrop}>{p.product_name}</Text>
                    <Text style={c.priceMarket}>{p.supplier_name} · {p.district}</Text>
                  </View>
                  <Text style={c.priceVal}>${parseFloat(p.price_usd).toFixed(2)}/{p.unit}</Text>
                </View>
              ))}
              <TouchableOpacity style={c.reportCta} onPress={()=>{setPostType('selling');setModal('post');}}>
                <Text style={c.reportCtaText}>📢 Selling or buying? Post your price →</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* LISTINGS: selling / buying / inputs */}
          {(tab==='selling'||tab==='buying'||tab==='inputs')&&(
            <FlatList
              data={filteredListings}
              keyExtractor={item=>item.id}
              contentContainerStyle={{padding:14,gap:10,paddingBottom:24}}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={G}/>}
              ListHeaderComponent={filteredListings.length>0?(
                <View style={c.listHdr}>
                  <Text style={c.listHdrText}>
                    {filteredListings.length} listing{filteredListings.length!==1?'s':''}
                    {provinceFilter?` · ${provinceFilter}`:' · All Zimbabwe'}
                  </Text>
                  <TouchableOpacity
                    style={[c.postMiniBtn,{backgroundColor:TYPE_COLORS[tabTypeMap[tab]??'selling']}]}
                    onPress={()=>{setPostType(tabTypeMap[tab]??'selling');setModal('post');}}>
                    <Text style={c.postMiniBtnText}>+ Post</Text>
                  </TouchableOpacity>
                </View>
              ):null}
              ListEmptyComponent={
                <View style={c.emptyWrap}>
                  <Text style={{fontSize:40,marginBottom:12}}>{tab==='selling'?'🌱':tab==='buying'?'🛒':'🧴'}</Text>
                  <Text style={c.emptyTitle}>No listings yet</Text>
                  <Text style={c.emptySub}>Be the first to post in {provinceFilter||'Zimbabwe'}</Text>
                  <TouchableOpacity style={[c.emptyPostBtn,{backgroundColor:TYPE_COLORS[tabTypeMap[tab]??'selling']}]}
                    onPress={()=>{setPostType(tabTypeMap[tab]??'selling');setModal('post');}}>
                    <Text style={c.emptyPostBtnText}>+ Post listing</Text>
                  </TouchableOpacity>
                </View>
              }
              renderItem={({item})=>(
                <ListingCard item={item} onPress={()=>openDetail(item)} onCall={()=>callItem(item)}/>
              )}
            />
          )}

          {/* MY LISTINGS */}
          {tab==='mine'&&(
            <FlatList
              data={myListings}
              keyExtractor={item=>item.id}
              contentContainerStyle={{padding:14,gap:10,paddingBottom:24}}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={G}/>}
              ListEmptyComponent={
                <View style={c.emptyWrap}>
                  <Text style={{fontSize:40,marginBottom:12}}>📋</Text>
                  <Text style={c.emptyTitle}>No listings yet</Text>
                  <Text style={c.emptySub}>Post your first listing to reach buyers across Zimbabwe</Text>
                  <TouchableOpacity style={[c.emptyPostBtn,{backgroundColor:G}]}
                    onPress={()=>{setPostType('selling');setModal('post');}}>
                    <Text style={c.emptyPostBtnText}>+ Post listing</Text>
                  </TouchableOpacity>
                </View>
              }
              renderItem={({item})=>(
                <View style={c.myCard}>
                  <View style={c.myCardTop}>
                    <View style={[c.typePill,{backgroundColor:TYPE_BG[item.type]}]}>
                      <Text style={[c.typePillText,{color:TYPE_COLORS[item.type]}]}>{TYPE_LABELS[item.type]}</Text>
                    </View>
                    <Text style={[c.freshLabel,{color:freshness(item.created_at).color}]}>
                      {freshness(item.created_at).label}
                    </Text>
                  </View>
                  <Text style={c.myCrop}>{item.crop_name}</Text>
                  <Text style={c.myDetail}>{item.quantity_kg.toLocaleString()} kg · ${item.price_usd_kg.toFixed(2)}/kg · {item.district}</Text>
                  <Text style={c.myStatus}>
                    {item.status==='active'?'🟢 Active':item.status==='sold'?'✅ Sold':'⏱ Expired'}
                    {item.deal_count>0?`  ·  ${item.deal_count} deal${item.deal_count>1?'s':''}`:'' }
                  </Text>
                  <View style={c.myActions}>
                    <TouchableOpacity style={c.myActionBtn} onPress={()=>Alert.alert('Edit price','Feature coming in v1.1')}>
                      <Text style={c.myActionText}>✏️ Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[c.myActionBtn,{backgroundColor:AMBER_LIGHT}]}
                      onPress={()=>boostListing(item.id).then(loadMyListings)}>
                      <Text style={[c.myActionText,{color:'#7A4F00'}]}>📌 Boost $0.50</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[c.myActionBtn,{backgroundColor:RED_LIGHT}]}
                      onPress={()=>Alert.alert('Delete?','This cannot be undone.',[
                        {text:'Cancel',style:'cancel'},
                        {text:'Delete',style:'destructive',onPress:()=>deleteListing(item.id).then(loadMyListings)},
                      ])}>
                      <Text style={[c.myActionText,{color:RED}]}>🗑</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
        </>
      )}

      {/* Modals */}
      <PostListingModal visible={activeModal==='post'} onClose={()=>setModal(null)} onSuccess={handlePostSuccess} initialType={postType}/>
      <ListingDetailModal item={selectedItem} visible={activeModal==='detail'} onClose={()=>setModal(null)} onDeal={()=>setModal('deal')}/>
      <DealModal item={selectedItem} visible={activeModal==='deal'} onClose={()=>setModal(null)} onConfirmed={()=>{setModal(null);loadListings();}}/>
      <PriceAlertModal visible={activeModal==='alert'} onClose={()=>setModal(null)}/>
    </View>
  );
}

// ══════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════
const c = StyleSheet.create({
  screen:        {flex:1,backgroundColor:Colors.background},
  header:        {backgroundColor:G,paddingHorizontal:16,paddingTop:14,paddingBottom:12},
  headerTop:     {flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10},
  eyebrow:       {fontSize:10,fontWeight:'700',color:'rgba(255,255,255,0.6)',textTransform:'uppercase',letterSpacing:0.1},
  title:         {fontSize:22,fontWeight:'700',color:'white'},
  headerActions: {flexDirection:'row',gap:8,alignItems:'center'},
  alertBtn:      {backgroundColor:'rgba(255,255,255,0.15)',borderRadius:8,padding:8},
  postBtn:       {backgroundColor:AMBER,borderRadius:8,paddingHorizontal:14,paddingVertical:8},
  postBtnText:   {fontSize:13,fontWeight:'700',color:'#1A1A0A'},
  ticker:        {flexDirection:'row',alignItems:'center',gap:10,backgroundColor:'rgba(0,0,0,0.2)',borderRadius:8,paddingHorizontal:10,paddingVertical:6},
  tickerLabel:   {fontSize:9,fontWeight:'700',color:AMBER,textTransform:'uppercase',letterSpacing:0.1,flexShrink:0},
  tickerItem:    {fontSize:12,color:'rgba(255,255,255,0.8)'},
  tickerPrice:   {color:'#97C459',fontWeight:'700'},
  tabBar:        {backgroundColor:'white',borderBottomWidth:0.5,borderBottomColor:Colors.slate100,flexGrow:0},
  tabChip:       {paddingHorizontal:14,paddingVertical:7,borderRadius:20,borderWidth:0.5,borderColor:Colors.slate200,backgroundColor:Colors.background},
  tabChipText:   {fontSize:12,fontWeight:'500',color:Colors.slate600},
  searchBar:     {flexDirection:'row',gap:8,paddingHorizontal:14,paddingVertical:10,backgroundColor:'white',borderBottomWidth:0.5,borderBottomColor:Colors.slate100},
  searchInput:   {flex:1,backgroundColor:Colors.background,borderRadius:8,paddingHorizontal:12,paddingVertical:8,fontSize:13,borderWidth:0.5,borderColor:Colors.slate200},
  filterBtn:     {width:36,height:36,backgroundColor:Colors.background,borderRadius:8,alignItems:'center',justifyContent:'center',borderWidth:0.5,borderColor:Colors.slate200},
  filterPanel:   {backgroundColor:'white',paddingHorizontal:14,paddingBottom:10,borderBottomWidth:0.5,borderBottomColor:Colors.slate100},
  filterPanelLabel:{fontSize:10,fontWeight:'700',color:Colors.slate400,textTransform:'uppercase',marginBottom:6,marginTop:8},
  filterChip:    {paddingHorizontal:12,paddingVertical:5,borderRadius:16,borderWidth:0.5,borderColor:Colors.slate200,backgroundColor:Colors.background},
  filterChipActive:{backgroundColor:G,borderColor:G},
  filterChipText:{fontSize:11,color:Colors.slate600},
  loadingWrap:   {flex:1,alignItems:'center',justifyContent:'center',gap:12},
  loadingText:   {fontSize:13,color:Colors.slate400},
  offlineWrap:   {flex:1,alignItems:'center',justifyContent:'center',padding:40},
  offlineTitle:  {fontSize:16,fontWeight:'600',color:Colors.slate700,marginBottom:6},
  offlineSub:    {fontSize:13,color:Colors.slate400,textAlign:'center'},
  sectionHdr:    {marginBottom:4},
  sectionTitle:  {fontSize:13,fontWeight:'700',color:Colors.slate900},
  sectionSub:    {fontSize:11,color:Colors.slate400,marginTop:1},
  priceRow:      {flexDirection:'row',alignItems:'center',backgroundColor:'white',borderRadius:10,padding:12,borderWidth:0.5,borderColor:Colors.slate100},
  priceCrop:     {fontSize:13,fontWeight:'600',color:Colors.slate900},
  priceMarket:   {fontSize:11,color:Colors.slate400,marginTop:2},
  priceVal:      {fontSize:14,fontWeight:'700',color:G},
  priceTrend:    {fontSize:11,textAlign:'right',marginTop:2},
  reportCta:     {backgroundColor:G_LIGHT,borderRadius:10,padding:14,alignItems:'center',marginTop:8},
  reportCtaText: {fontSize:13,fontWeight:'600',color:G},
  card:          {backgroundColor:'white',borderRadius:12,borderWidth:0.5,borderColor:Colors.slate100,overflow:'hidden',...Shadows.sm},
  cardBoosted:   {borderColor:AMBER,borderWidth:1.5},
  boostedBanner: {backgroundColor:AMBER_LIGHT,paddingHorizontal:12,paddingVertical:5,borderBottomWidth:0.5,borderBottomColor:'#FAC775'},
  boostedText:   {fontSize:11,fontWeight:'600',color:'#7A4F00'},
  cardTop:       {flexDirection:'row',padding:14},
  cardPhoto:     {width:70,height:70,borderRadius:8,overflow:'hidden',flexShrink:0},
  cardPhotoImg:  {width:'100%',height:'100%'},
  cardPhotoPlaceholder:{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',borderRadius:8},
  cardTitleRow:  {flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:5},
  cardCrop:      {fontSize:15,fontWeight:'700',color:Colors.slate900,flex:1},
  freshLabel:    {fontSize:10,fontWeight:'600',marginLeft:8,flexShrink:0},
  cardBadgeRow:  {flexDirection:'row',gap:5,flexWrap:'wrap',marginBottom:5},
  typePill:      {paddingHorizontal:8,paddingVertical:2,borderRadius:6},
  typePillText:  {fontSize:10,fontWeight:'700'},
  gradePill:     {paddingHorizontal:8,paddingVertical:2,borderRadius:6,backgroundColor:Colors.slate050},
  gradeText:     {fontSize:10,color:Colors.slate600},
  verifiedBadge: {paddingHorizontal:6,paddingVertical:2,borderRadius:6,backgroundColor:G_LIGHT},
  verifiedText:  {fontSize:9,fontWeight:'700',color:G},
  proBadge:      {paddingHorizontal:6,paddingVertical:2,borderRadius:6,backgroundColor:AMBER_LIGHT},
  proText:       {fontSize:9,fontWeight:'700',color:'#7A4F00'},
  cardLocation:  {fontSize:11,color:Colors.slate400,marginBottom:6},
  cardPriceRow:  {flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end'},
  cardPrice:     {fontSize:18,fontWeight:'800'},
  cardQty:       {fontSize:11,color:Colors.slate400,marginTop:1},
  callBtn:       {borderRadius:8,paddingHorizontal:12,paddingVertical:7},
  callBtnText:   {fontSize:12,fontWeight:'700',color:'white'},
  cardDesc:      {fontSize:12,color:Colors.slate400,paddingHorizontal:14,paddingBottom:10,lineHeight:17},
  cardFooter:    {flexDirection:'row',justifyContent:'space-between',paddingHorizontal:14,paddingBottom:12,borderTopWidth:0.5,borderTopColor:Colors.slate050,paddingTop:8},
  cardSeller:    {fontSize:11,color:Colors.slate400},
  dealCount:     {fontSize:11,color:G,fontWeight:'600'},
  listHdr:       {flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8},
  listHdrText:   {fontSize:12,color:Colors.slate400},
  postMiniBtn:   {borderRadius:6,paddingHorizontal:12,paddingVertical:5},
  postMiniBtnText:{fontSize:12,fontWeight:'700',color:'white'},
  emptyWrap:     {padding:40,alignItems:'center'},
  emptyTitle:    {fontSize:15,fontWeight:'600',color:Colors.slate700,marginBottom:6},
  emptySub:      {fontSize:13,color:Colors.slate400,textAlign:'center',marginBottom:16},
  emptyPostBtn:  {borderRadius:8,paddingHorizontal:20,paddingVertical:10},
  emptyPostBtnText:{fontSize:13,fontWeight:'700',color:'white'},
  myCard:        {backgroundColor:'white',borderRadius:10,padding:14,borderWidth:0.5,borderColor:Colors.slate100},
  myCardTop:     {flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:6},
  myCrop:        {fontSize:15,fontWeight:'700',color:Colors.slate900,marginBottom:3},
  myDetail:      {fontSize:12,color:Colors.slate400,marginBottom:4},
  myStatus:      {fontSize:12,color:Colors.slate400,marginBottom:10},
  myActions:     {flexDirection:'row',gap:8},
  myActionBtn:   {flex:1,backgroundColor:G_LIGHT,borderRadius:7,paddingVertical:7,alignItems:'center'},
  myActionText:  {fontSize:12,fontWeight:'600',color:G},
});

const mp = StyleSheet.create({
  container:   {flex:1,backgroundColor:Colors.background},
  header:      {paddingTop:20,paddingHorizontal:20,paddingBottom:16},
  closeBtn:    {alignSelf:'flex-end',backgroundColor:'rgba(255,255,255,0.2)',borderRadius:20,padding:6,marginBottom:8},
  closeTxt:    {color:'white',fontSize:14,fontWeight:'600'},
  headerTitle: {fontSize:20,fontWeight:'700',color:'white'},
  headerSub:   {fontSize:12,color:'rgba(255,255,255,0.7)',marginTop:2},
  stepDots:    {flexDirection:'row',gap:6,marginTop:10},
  dot:         {width:6,height:6,borderRadius:3,backgroundColor:'rgba(255,255,255,0.3)'},
  dotActive:   {backgroundColor:'white',width:18},
  label:       {fontSize:12,fontWeight:'700',color:Colors.slate400,textTransform:'uppercase',letterSpacing:0.07},
  typeGrid:    {flexDirection:'row',gap:8},
  typeCard:    {flex:1,borderRadius:10,borderWidth:1.5,borderColor:Colors.slate200,backgroundColor:'white',padding:12,alignItems:'center'},
  typeTitle:   {fontSize:12,fontWeight:'700',color:Colors.slate800,textAlign:'center',marginBottom:3},
  typeDesc:    {fontSize:10,color:Colors.slate400,textAlign:'center'},
  input:       {backgroundColor:'white',borderRadius:8,borderWidth:1,borderColor:Colors.slate200,paddingHorizontal:14,paddingVertical:11,fontSize:14,color:Colors.slate900},
  inputText:   {fontSize:14,color:Colors.slate900},
  inputPh:     {fontSize:14,color:Colors.slate400},
  picker:      {backgroundColor:'white',borderRadius:8,borderWidth:1,borderColor:Colors.slate200,overflow:'hidden'},
  pickerOpt:   {paddingHorizontal:14,paddingVertical:10,borderBottomWidth:0.5,borderBottomColor:Colors.slate100},
  pickerOptText:{fontSize:13,color:Colors.slate800},
  gradeRow:    {flexDirection:'row',gap:8},
  gradeBtn:    {flex:1,borderRadius:8,borderWidth:1,borderColor:Colors.slate200,paddingVertical:9,alignItems:'center',backgroundColor:'white'},
  gradeBtnText:{fontSize:12,fontWeight:'600',color:Colors.slate700},
  unitBtn:     {paddingHorizontal:12,paddingVertical:9,borderRadius:8,borderWidth:1,borderColor:Colors.slate200,backgroundColor:'white'},
  unitBtnText: {fontSize:13,fontWeight:'600',color:Colors.slate600},
  conv:        {fontSize:11,color:Colors.slate400},
  suggChip:    {backgroundColor:G_LIGHT,borderRadius:8,padding:10},
  suggText:    {fontSize:12,color:G,fontWeight:'500'},
  totalCard:   {backgroundColor:G_LIGHT,borderRadius:10,padding:14,alignItems:'center'},
  totalLabel:  {fontSize:11,color:Colors.slate400,marginBottom:4},
  totalVal:    {fontSize:26,fontWeight:'800'},
  totalNote:   {fontSize:11,color:Colors.slate400,marginTop:3},
  broadcastCard:{backgroundColor:'white',borderRadius:10,borderWidth:1.5,borderColor:Colors.slate200,padding:14,flexDirection:'row',alignItems:'flex-start',gap:12},
  bcTitle:     {fontSize:13,fontWeight:'700',color:Colors.slate900,marginBottom:3},
  bcDesc:      {fontSize:12,color:Colors.slate400,lineHeight:17},
  bcNote:      {fontSize:10,color:Colors.slate400,marginTop:4},
  toggle:      {width:40,height:22,borderRadius:11,backgroundColor:Colors.slate200,justifyContent:'center',paddingHorizontal:2,marginTop:4,flexShrink:0},
  toggleThumb: {width:18,height:18,borderRadius:9,backgroundColor:'white'},
  toggleThumbOn:{transform:[{translateX:18}]},
  offlineNote: {backgroundColor:Colors.slate050,borderRadius:8,padding:12},
  offlineNoteText:{fontSize:12,color:Colors.slate600,lineHeight:17},
  footer:      {flexDirection:'row',padding:16,paddingBottom:24,backgroundColor:'white',borderTopWidth:0.5,borderTopColor:Colors.slate100},
  backBtn:     {paddingHorizontal:16,paddingVertical:12,borderRadius:8,borderWidth:1,borderColor:Colors.slate200},
  backBtnText: {fontSize:13,fontWeight:'600',color:Colors.slate700},
  nextBtn:     {paddingHorizontal:24,paddingVertical:12,borderRadius:8,alignItems:'center',justifyContent:'center'},
  nextBtnText: {fontSize:14,fontWeight:'700',color:'white'},
});

const md = StyleSheet.create({
  header:     {paddingTop:20,paddingHorizontal:20,paddingBottom:16},
  closeTxt:   {color:'white',fontSize:14,fontWeight:'600',marginBottom:8},
  headerTitle:{fontSize:22,fontWeight:'700',color:'white'},
  headerSub:  {fontSize:12,color:'rgba(255,255,255,0.7)',marginTop:2},
  photo:      {width:'100%',height:200,borderRadius:12,backgroundColor:Colors.slate100},
  badgeRow:   {flexDirection:'row',gap:6,flexWrap:'wrap'},
  badge:      {paddingHorizontal:10,paddingVertical:4,borderRadius:8,backgroundColor:Colors.slate050},
  badgeText:  {fontSize:11,fontWeight:'600',color:Colors.slate600},
  priceCard:  {backgroundColor:'white',borderRadius:12,padding:16,flexDirection:'row',borderWidth:0.5,borderColor:Colors.slate100},
  priceLabel: {fontSize:10,fontWeight:'700',color:Colors.slate400,textTransform:'uppercase',marginBottom:4},
  priceVal:   {fontSize:18,fontWeight:'800'},
  priceQty:   {fontSize:15,fontWeight:'700',color:Colors.slate900},
  sellerCard: {backgroundColor:'white',borderRadius:12,padding:14,borderWidth:0.5,borderColor:Colors.slate100},
  sellerName: {fontSize:15,fontWeight:'700',color:Colors.slate900,marginBottom:3},
  sellerDeals:{fontSize:12,color:G,fontWeight:'600',marginBottom:3},
  sellerLoc:  {fontSize:12,color:Colors.slate400,marginBottom:2},
  descCard:   {backgroundColor:'white',borderRadius:12,padding:14,borderWidth:0.5,borderColor:Colors.slate100},
  descLabel:  {fontSize:11,fontWeight:'700',color:Colors.slate400,textTransform:'uppercase',marginBottom:6},
  descText:   {fontSize:13,color:Colors.slate700,lineHeight:20},
  callBtn:    {borderRadius:12,padding:14,alignItems:'center'},
  callBtnText:{fontSize:14,fontWeight:'700',color:'white'},
  dealBtn:    {backgroundColor:G_LIGHT,borderRadius:12,padding:14,alignItems:'center',borderWidth:1,borderColor:G},
  dealBtnText:{fontSize:14,fontWeight:'700',color:G},
  dealNote:   {fontSize:11,color:Colors.slate400,textAlign:'center',lineHeight:17},
});