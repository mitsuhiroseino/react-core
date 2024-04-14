import { AnimateValueOptions, AnimateValueState } from '@visue/web-core/utils/anim/animateValue';

/**
 * アニメーション中のステート
 */
export type UseValueAnimationState = AnimateValueState;

/**
 * オプション
 */
export type UseValueAnimationOptions<S extends UseValueAnimationState = UseValueAnimationState> =
  AnimateValueOptions<S> & {
    /**
     * インスタンスやDOMに直接値を設定する為の関数
     * 設定されている場合: アニメーション中の値はステートに反映せず、アニメーション完了後に変更後の値をステートへ反映する
     * 設定されていない場合: アニメーション中の値、変更後の値共にステートへ反映する
     * @param value
     * @returns
     */
    setValue?: (value: any | undefined) => void;

    /**
     * useValueAnimationの引数のvalueから戻り値の型に変換するための関数
     * @param value 入力値
     * @returns 戻り値
     */
    convert?: (value: any | undefined) => any;

    /**
     * 初期値を固定する
     * 未指定、falseの場合は前回の値を初期値としてアニメーションを行う
     */
    staticInitialValue?: boolean;
  };
