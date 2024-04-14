/**
 * オプション
 */
export type UseGeolocationOptions = {
  /**
   * 正確な位置を取得
   */
  enableHighAccuracy?: boolean;

  /**
   * 位置情報取得のタイムアウト
   */
  timeout?: number;

  /**
   * 位置情報の有効期間
   */
  maximumAge?: number;

  /**
   * 位置情報の取得間隔
   */
  interval?: number;
};
