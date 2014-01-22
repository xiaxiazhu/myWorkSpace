/**
 * ����ʱ���
 * Effects ģ��
 * @author jide<jide@taobao.com>
 *
 */
/*global KISSY */

KISSY.add('gallery/countdown/1.0/effects', function (S, Countdown) {

    /**
     * Static attributes
     */
    Countdown.Effects = {
        // ��ͨ������Ч��
        normal: {
            paint: function () {
                var me = this,
                    content;

                // �ҵ�ֵ�����ı��hand
                S.each(me.hands, function (hand) {
                    if (hand.lastValue !== hand.value) {
                        // �����µ�markup
                        content = '';

                        S.each(me._toDigitals(hand.value, hand.bits), function (digital) {
                            content += me._html(digital, '', 'digital');
                        });

                        // ������
                        hand.node.html(content);
                    }
                });
            }
        },
        // ����Ч��
        slide: {
            paint: function () {
                var me = this,
                    content, bits,
                    digitals, oldDigitals;

                // �ҵ�ֵ�����ı��hand
                S.each(me.hands, function (hand) {
                    if (hand.lastValue !== hand.value) {
                        // �����µ�markup
                        content = '';
                        bits = hand.bits;
                        digitals = me._toDigitals(hand.value, bits);
                        if (hand.lastValue === undefined) {
                            oldDigitals = digitals;
                        } else {
                            oldDigitals = me._toDigitals(hand.lastValue, bits);
                        }

                        while (bits--) {
                            if (oldDigitals[bits] !== digitals[bits]) {
                                content = me._html([me._html(digitals[bits], '', 'digital'), me._html(oldDigitals[bits], '', 'digital')], 'slide-wrap') + content;
                            } else {
                                content = me._html(digitals[bits], '', 'digital') + content;
                            }
                        }

                        // ������
                        hand.node.html(content);
                    }
                });
                
                Countdown.Effects.slide.afterPaint.apply(me);
            },
            afterPaint: function () {
                // �ҵ�ֵ�����ı��hand
                S.each(this.hands, function (hand) {
                    if (hand.lastValue !== hand.value && hand.lastValue !== undefined) {
                        var node = hand.node,
                            height = node.one('.digital').height();

                        node.css('height', height);
                        node.all('.slide-wrap').css('top', -height).animate('top: 0', 0.5, 'easeIn');
                    }
                });
            }
        },
        // ����Ч����
        // ����Ļ���Ҫʵ��DOM�ڵ������Ч�����Լ۱Ȳ���
/*
// ֻ������
<s class="flip-wrap">
    to be update...
</s>
// ��ָ��
<s class="hand">
    <s class="handlet new">
        <s class="digital digital-1"></s>
        <s class="digital digital-9"></s>
    </s>
    <s class="handlet old">
        <s class="digital digital-2"></s>
        <s class="digital digital-0"></s>
    </s>
    <s class="handlet mask">
        <s class="digital digital-2"></s>
        <s class="digital digital-0"></s>
    </s>
</s>
*/
        flip: {
            paint: function () {
                var me = this,
                    m_mask, m_new, m_old;

                // �ҵ�ֵ�����ı��hand
                S.each(me.hands, function (hand) {
                    if (hand.lastValue !== hand.value) {
                        // �����µ�markup
                        m_mask = '';
                        m_new = '';
                        m_old = '';

                        S.each(me._toDigitals(hand.value, hand.bits), function (digital) {
                            m_new += me._html(digital, '', 'digital');
                        });
                        if (hand.lastValue === undefined) {
                            // ����
                            hand.node.html(m_new);
                        } else {
                            m_new = me._html(m_new, 'handlet');
                            S.each(me._toDigitals(hand.lastValue, hand.bits), function (digital) {
                                m_old += me._html(digital, '', 'digital');
                            });
                            m_mask = me._html(m_old, 'handlet mask');
                            m_old = me._html(m_old, 'handlet');

                            // ����
                            hand.node.html(m_new + m_old + m_mask);
                        }
                    }
                });
                
                Countdown.Effects.flip.afterPaint.apply(me);
            },
            afterPaint: function () {
                // �ҵ�ֵ�����ı��hand
                S.each(this.hands, function (hand) {
                    if (hand.lastValue !== hand.value && hand.lastValue !== undefined) {
                        // Ȼ���������Ӷ���Ч��
                        var node = hand.node,
                            ns = node.all('.handlet'),
                            n_new = ns.item(0),
                            n_old = ns.item(1),
                            n_mask = ns.item(2),
                            width = node.width(),
                            height = node.height(),
                            h_top = Math.floor(height / 2),
                            h_bottom = height - h_top;

                        // prepare
                        n_old.css({
                            clip: 'rect(' + h_top + 'px, ' + width + 'px, ' + height + 'px, 0)'
                        });

                        // ����һ���ϰ벿��
                        n_mask.css({
                            overflow: 'hidden',
                            height: h_top + 'px'
                        });
                        n_mask.animate({
                            top: h_top + 'px',
                            height: 0
                        }, 0.15, 'easeNone', function () {
                            // ���������°벿��
                            n_mask.html(n_new.html());
                            n_mask.css({
                                top: 0,
                                height: h_top + 'px',
                                clip: 'rect(' + h_top + 'px, ' + width + 'px, ' + height + 'px, 0)'
                            });
                            n_mask.animate('height: ' + height + 'px', 0.3, 'bounceOut');
                        });
                    }
                });
            }
        }
    };

}, {
    requires: ["./countdown"]
});
