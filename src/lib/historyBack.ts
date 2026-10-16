type BackHandler = { onBack: () => boolean; route: boolean };

const handlers: BackHandler[] = [];
let stopListening: (() => void) | undefined;

// 화면 상태를 먼저 되돌리고, 처리할 상태가 없으면 Next 경로를 되돌린다.
// 브라우저 history는 Next가 관리한다. 가짜 항목을 쌓으면 경로 복귀와 재마운트가 충돌한다.
export function installHistoryBack(
  onBack: () => boolean,
  options: { route?: boolean } = {},
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = { onBack, route: options.route ?? false };
  handlers.push(handler);

  if (!stopListening) {
    let disposed = false;
    let unsubscribe: (() => void) | undefined;
    stopListening = () => {
      disposed = true;
      unsubscribe?.();
    };
    import('@apps-in-toss/web-framework')
      .then(({ graniteEvent, closeView }) => {
        if (disposed) return;
        unsubscribe = graniteEvent.addEventListener('backEvent', {
          onEvent: () => {
            const ordered = [...handlers].reverse();
            for (const route of [false, true]) {
              if (ordered.some((entry) => entry.route === route && entry.onBack())) return;
            }
            void closeView().catch(() => {});
          },
        });
      })
      .catch(() => {});
  }

  return () => {
    const index = handlers.indexOf(handler);
    if (index === -1) return;
    handlers.splice(index, 1);
    if (handlers.length === 0) {
      stopListening?.();
      stopListening = undefined;
    }
  };
}
